// Helpers de formatage (euros, dates, mois)

export function euros(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function dateFR(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(date);
}

// "2026-06" -> "Juin 2026"
export function monthLabel(month: string): string {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, (m || 1) - 1, 1);
  const label = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// Mois courant au format "AAAA-MM"
export function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// Mois adjacent ("2026-06" + 1 -> "2026-07")
export function shiftMonth(month: string, delta: number): string {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, (m || 1) - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export type PaymentStatus = "paid" | "partial" | "unpaid";

export function paymentStatus(amountDue: number, amountPaid: number): PaymentStatus {
  if (amountPaid <= 0) return "unpaid";
  if (amountPaid >= amountDue) return "paid";
  return "partial";
}
