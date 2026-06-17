import { paymentStatus } from "@/lib/format";
import { markPaid, markUnpaid, recordPayment } from "@/app/admin/actions";

export function PaymentStatusBadge({
  amountDue,
  amountPaid,
}: {
  amountDue: number;
  amountPaid: number;
}) {
  const s = paymentStatus(amountDue, amountPaid);
  const map = {
    paid: ["Payé", "bg-green-100 text-green-700"],
    partial: ["Partiel", "bg-amber-100 text-amber-700"],
    unpaid: ["Impayé", "bg-red-100 text-red-700"],
  } as const;
  const [label, cls] = map[s];
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

// Bouton unique : marquer payé (montant plein) ou annuler.
export function QuickPayToggle({
  tenantId,
  month,
  amountDue,
  amountPaid,
}: {
  tenantId: string;
  month: string;
  amountDue: number;
  amountPaid: number;
}) {
  const fullyPaid = amountDue > 0 && amountPaid >= amountDue;
  return (
    <form action={fullyPaid ? markUnpaid : markPaid}>
      <input type="hidden" name="tenantId" value={tenantId} />
      <input type="hidden" name="month" value={month} />
      <input type="hidden" name="amountDue" value={amountDue} />
      <button
        type="submit"
        className={
          fullyPaid
            ? "rounded-full border border-line px-3 py-1 text-xs font-medium text-muted transition hover:border-red-300 hover:text-red-600"
            : "rounded-full bg-forest px-3 py-1 text-xs font-semibold text-white transition hover:bg-forest-dark"
        }
      >
        {fullyPaid ? "Annuler" : "Marquer payé"}
      </button>
    </form>
  );
}

// Champ montant + enregistrement d'un paiement (éventuellement partiel).
export function PaymentEditor({
  tenantId,
  month,
  amountDue,
  amountPaid,
}: {
  tenantId: string;
  month: string;
  amountDue: number;
  amountPaid: number;
}) {
  return (
    <form action={recordPayment} className="flex items-center gap-1.5">
      <input type="hidden" name="tenantId" value={tenantId} />
      <input type="hidden" name="month" value={month} />
      <input type="hidden" name="amountDue" value={amountDue} />
      <input
        name="amountPaid"
        type="number"
        step="0.01"
        min="0"
        defaultValue={amountPaid}
        className="w-20 rounded-lg border border-line bg-white px-2 py-1 text-right text-sm outline-none focus:border-forest"
      />
      <span className="text-sm text-muted">€</span>
      <button
        type="submit"
        className="rounded-lg bg-forest/10 px-2.5 py-1 text-xs font-semibold text-forest transition hover:bg-forest hover:text-white"
      >
        OK
      </button>
    </form>
  );
}
