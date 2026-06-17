import { prisma } from "@/lib/prisma";
import type { Room, Tenant, Payment } from "@prisma/client";

export type { Room, Tenant, Payment };
export type TenantWithRoom = Tenant & { room: Room | null };

// --- Vitrine (public) : on ne plante jamais si la base est indisponible ---
export async function getPublicRooms(): Promise<Room[]> {
  try {
    return await prisma.room.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

// --- Admin ---
export async function getRooms(): Promise<Room[]> {
  return prisma.room.findMany({ orderBy: { order: "asc" } });
}

export async function getTenants(): Promise<TenantWithRoom[]> {
  return prisma.tenant.findMany({
    include: { room: true },
    orderBy: [{ moveOutDate: { sort: "asc", nulls: "first" } }, { fullName: "asc" }],
  });
}

// Locataires « facturables » pour un mois donné (AAAA-MM) :
// affectés à une chambre, entrés avant la fin du mois et pas encore partis avant le début.
export async function getBillableTenants(month: string): Promise<TenantWithRoom[]> {
  const [year, m] = month.split("-").map(Number);
  const firstDay = new Date(year, m - 1, 1);
  const lastDay = new Date(year, m, 0, 23, 59, 59);

  const tenants = await prisma.tenant.findMany({
    where: { roomId: { not: null } },
    include: { room: true },
    orderBy: { room: { order: "asc" } },
  });

  return tenants.filter((t) => {
    const inOk = !t.moveInDate || t.moveInDate <= lastDay;
    const outOk = !t.moveOutDate || t.moveOutDate >= firstDay;
    return inOk && outOk;
  });
}

export type MonthlyRow = {
  tenant: TenantWithRoom;
  amountDue: number;
  amountPaid: number;
  payment: Payment | null;
};

// Tableau des loyers d'un mois : une ligne par locataire facturable.
export async function getMonthlyRows(month: string): Promise<MonthlyRow[]> {
  const tenants = await getBillableTenants(month);
  const payments = await prisma.payment.findMany({
    where: { month, tenantId: { in: tenants.map((t) => t.id) } },
  });
  const byTenant = new Map(payments.map((p) => [p.tenantId, p]));

  return tenants.map((tenant) => {
    const payment = byTenant.get(tenant.id) ?? null;
    const roomDue = tenant.room ? tenant.room.rent + tenant.room.charges : 0;
    const amountDue = payment?.amountDue ?? roomDue;
    const amountPaid = payment?.amountPaid ?? 0;
    return { tenant, amountDue, amountPaid, payment };
  });
}
