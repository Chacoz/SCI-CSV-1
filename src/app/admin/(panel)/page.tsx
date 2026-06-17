import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getMonthlyRows } from "@/lib/data";
import { currentMonth, monthLabel, euros } from "@/lib/format";
import { PaymentStatusBadge, QuickPayToggle } from "@/components/payment";

export const dynamic = "force-dynamic";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-line">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-forest-dark">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default async function Dashboard() {
  const month = currentMonth();
  const [rows, roomCount] = await Promise.all([
    getMonthlyRows(month),
    prisma.room.count(),
  ]);

  const totalDue = rows.reduce((s, r) => s + r.amountDue, 0);
  const totalPaid = rows.reduce((s, r) => s + r.amountPaid, 0);
  const remaining = totalDue - totalPaid;
  const occupied = rows.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-dark">Tableau de bord</h1>
          <p className="text-sm text-muted">Loyers de {monthLabel(month)}</p>
        </div>
        <Link
          href="/admin/loyers"
          className="text-sm font-medium text-forest hover:text-forest-dark"
        >
          Historique des loyers →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Chambres occupées" value={`${occupied} / ${roomCount}`} />
        <Stat label="Loyers attendus" value={euros(totalDue)} hint="ce mois-ci" />
        <Stat label="Encaissé" value={euros(totalPaid)} hint="ce mois-ci" />
        <Stat
          label="Reste à encaisser"
          value={euros(remaining)}
          hint={remaining > 0 ? "à relancer" : "tout est réglé 🎉"}
        />
      </div>

      <section className="rounded-2xl bg-card shadow-sm ring-1 ring-line">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-forest-dark">
            Loyers du mois
          </h2>
        </div>
        {rows.length === 0 ? (
          <div className="px-5 py-10 text-center text-muted">
            Aucun locataire actif ce mois-ci.{" "}
            <Link href="/admin/locataires" className="font-medium text-forest hover:underline">
              Ajouter un locataire
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted">
                <th className="px-5 py-3 font-medium">Chambre</th>
                <th className="px-5 py-3 font-medium">Locataire</th>
                <th className="px-5 py-3 text-right font-medium">Dû</th>
                <th className="px-5 py-3 text-right font-medium">Payé</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.tenant.id} className="border-t border-line">
                  <td className="px-5 py-3 text-muted">{r.tenant.room?.name ?? "—"}</td>
                  <td className="px-5 py-3 font-medium text-ink">{r.tenant.fullName}</td>
                  <td className="px-5 py-3 text-right">{euros(r.amountDue)}</td>
                  <td className="px-5 py-3 text-right">{euros(r.amountPaid)}</td>
                  <td className="px-5 py-3">
                    <PaymentStatusBadge amountDue={r.amountDue} amountPaid={r.amountPaid} />
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
