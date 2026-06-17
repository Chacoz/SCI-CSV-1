"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  passwordMatches,
  createSession,
  destroySession,
} from "@/lib/auth";

// --- Helpers de parsing de formulaire ---
function str(v: FormDataEntryValue | null): string | undefined {
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? undefined : s;
}
function toMoney(v: FormDataEntryValue | null): number {
  const s = String(v ?? "").replace(",", ".").replace(/[^0-9.]/g, "");
  if (s === "") return 0;
  const n = parseFloat(s);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}
function toFloatOrNull(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").replace(",", ".").replace(/[^0-9.]/g, "");
  if (s === "") return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}
function toDateOrNull(v: FormDataEntryValue | null): Date | null {
  const s = str(v);
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// --- Authentification ---
export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) {
    return { error: "Mot de passe incorrect." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

// --- Locataires ---
export async function createTenant(formData: FormData): Promise<void> {
  await requireAuth();
  const fullName = str(formData.get("fullName"));
  if (!fullName) return;
  await prisma.tenant.create({
    data: {
      fullName,
      email: str(formData.get("email")),
      phone: str(formData.get("phone")),
      roomId: str(formData.get("roomId")) ?? null,
      moveInDate: toDateOrNull(formData.get("moveInDate")),
      moveOutDate: toDateOrNull(formData.get("moveOutDate")),
      deposit: toMoney(formData.get("deposit")),
      notes: str(formData.get("notes")),
    },
  });
  revalidatePath("/admin/locataires");
  revalidatePath("/admin");
}

export async function updateTenant(formData: FormData): Promise<void> {
  await requireAuth();
  const id = str(formData.get("id"));
  const fullName = str(formData.get("fullName"));
  if (!id || !fullName) return;
  await prisma.tenant.update({
    where: { id },
    data: {
      fullName,
      email: str(formData.get("email")) ?? null,
      phone: str(formData.get("phone")) ?? null,
      roomId: str(formData.get("roomId")) ?? null,
      moveInDate: toDateOrNull(formData.get("moveInDate")),
      moveOutDate: toDateOrNull(formData.get("moveOutDate")),
      deposit: toMoney(formData.get("deposit")),
      notes: str(formData.get("notes")) ?? null,
    },
  });
  revalidatePath("/admin/locataires");
  revalidatePath("/admin");
}

export async function deleteTenant(formData: FormData): Promise<void> {
  await requireAuth();
  const id = str(formData.get("id"));
  if (!id) return;
  await prisma.tenant.delete({ where: { id } });
  revalidatePath("/admin/locataires");
  revalidatePath("/admin");
}

// --- Chambres ---
export async function createRoom(formData: FormData): Promise<void> {
  await requireAuth();
  const name = str(formData.get("name"));
  if (!name) return;
  const count = await prisma.room.count();
  await prisma.room.create({
    data: {
      name,
      rent: toMoney(formData.get("rent")),
      charges: toMoney(formData.get("charges")),
      surface: toFloatOrNull(formData.get("surface")),
      description: str(formData.get("description")),
      photoUrl: str(formData.get("photoUrl")),
      available: formData.get("available") === "on",
      order: count + 1,
    },
  });
  revalidatePath("/admin/chambres");
  revalidatePath("/");
}

export async function updateRoom(formData: FormData): Promise<void> {
  await requireAuth();
  const id = str(formData.get("id"));
  if (!id) return;
  await prisma.room.update({
    where: { id },
    data: {
      name: str(formData.get("name")),
      rent: toMoney(formData.get("rent")),
      charges: toMoney(formData.get("charges")),
      surface: toFloatOrNull(formData.get("surface")),
      description: str(formData.get("description")) ?? null,
      photoUrl: str(formData.get("photoUrl")) ?? null,
      available: formData.get("available") === "on",
    },
  });
  revalidatePath("/admin/chambres");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteRoom(formData: FormData): Promise<void> {
  await requireAuth();
  const id = str(formData.get("id"));
  if (!id) return;
  await prisma.room.delete({ where: { id } });
  revalidatePath("/admin/chambres");
  revalidatePath("/");
}

// --- Loyers / paiements ---
async function upsertPayment(
  tenantId: string,
  month: string,
  amountDue: number,
  amountPaid: number,
): Promise<void> {
  await prisma.payment.upsert({
    where: { tenantId_month: { tenantId, month } },
    create: {
      tenantId,
      month,
      amountDue,
      amountPaid,
      paidDate: amountPaid > 0 ? new Date() : null,
    },
    update: {
      amountDue,
      amountPaid,
      paidDate: amountPaid > 0 ? new Date() : null,
    },
  });
}

export async function recordPayment(formData: FormData): Promise<void> {
  await requireAuth();
  const tenantId = str(formData.get("tenantId"));
  const month = str(formData.get("month"));
  if (!tenantId || !month) return;
  await upsertPayment(
    tenantId,
    month,
    toMoney(formData.get("amountDue")),
    toMoney(formData.get("amountPaid")),
  );
  revalidatePath("/admin");
  revalidatePath("/admin/loyers");
}

export async function markPaid(formData: FormData): Promise<void> {
  await requireAuth();
  const tenantId = str(formData.get("tenantId"));
  const month = str(formData.get("month"));
  if (!tenantId || !month) return;
  const amountDue = toMoney(formData.get("amountDue"));
  await upsertPayment(tenantId, month, amountDue, amountDue);
  revalidatePath("/admin");
  revalidatePath("/admin/loyers");
}

export async function markUnpaid(formData: FormData): Promise<void> {
  await requireAuth();
  const tenantId = str(formData.get("tenantId"));
  const month = str(formData.get("month"));
  if (!tenantId || !month) return;
  await upsertPayment(tenantId, month, toMoney(formData.get("amountDue")), 0);
  revalidatePath("/admin");
  revalidatePath("/admin/loyers");
}
