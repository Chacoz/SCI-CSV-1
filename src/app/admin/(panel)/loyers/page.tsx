import Link from "next/link";
import { getMonthlyRows } from "@/lib/data";
import { currentMonth, monthLabel, shiftMonth, euros } from "@/lib/format";
import { PaymentStatusBadge, PaymentEditor, QuickPayToggle } from "@/components/payment";

export const dynamic = "force-dynamic";

export default async function LoyersPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const month = monthParam && /^\d{4}-\d{2}$/.test(monthParam) ? monthParam : currentMonth();
  const rows = await getMonthlyRows(month);

  const totalDue = rows.reduce((s, r) => s + r.amountDue, 0);
  const totalPaid = rows.reduce((s, r) => s + r.amountPaid, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-forest-dark">Loyers</h1>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/loyers?month=${shiftMonth(month, -1)}`}
            className="rounded-full border border-line px-3 py-1.5 text-sm text-muted transition hover:bg-forest/5 hover:text-forest"
          >
            ← {monthLabel(shiftMonth(month, -1))}
          </Link>
          <span className="rounded-full bg-forest px-4 py-1.5 text-sm font-semibold text-white">
            {monthLabel(month)}
          </span>
          <Link
            href={`/admin/loyers?month=${shiftMonth(month, 1)}`}
            className="rounded-full border border-line px-3 py-1.5 text-sm text-muted transition hover:bg-forest/5 hover:text-forest"
          >
            {monthLabel(shiftMonth(month, 1))} →
          </Link>
        </div>
      </div>

      <p className="text-sm text-muted">
        Encaissé <span className="font-semibold text-forest">{euros(totalPaid)}</span> sur{" "}
        <span className="font-semibold text-ink">{euros(totalDue)}</span> attendus.
      </p>

      <section className="overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-line">
        {rows.length === 0 ? (
          <div className="px-5 py-10 text-center text-muted">
            Aucun locataire facturable sur ce mois.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted">
                <th className="px-5 py-3 font-medium">Chambre</th>
                <th className="px-5 py-3 font-medium">Locataire</th>
                <th className="px-5 py-3 text-right font-medium">Dû</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Montant payé</th>
                <th className="px-5 py-3 text-right font-medium">Solde</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.tenant.id} className="border-t border-line">
                  <td className="px-5 py-3 text-muted">{r.tenant.room?.name ?? "—"}</td>
                  <td className="px-5 py-3 font-medium text-ink">{r.tenant.fullName}</td>
                  <td className="px-5 py-3 text-right">{euros(r.amountDue)}</td>
                  <td className="px-5 py-3">
                    <PaymentStatusBadge amountDue={r.amountDue} amountPaid={r.amountPaid} />
                  </td>
                  <td className="px-5 py-3">
                    <PaymentEditor
                      tenantId={r.tenant.id}
                      month={month}
                      amountDue={r.amountDue}
                      amountPaid={r.amountPaid}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <QuickPayToggle
                        tenantId={r.tenant.id}
                        month={month}
                        amountDue={r.amountDue}
                        amountPaid={r.amountPaid}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
