import { getRooms, getTenants, type Room, type TenantWithRoom } from "@/lib/data";
import { euros, dateFR } from "@/lib/format";
import { createTenant, updateTenant, deleteTenant } from "../../actions";

export const dynamic = "force-dynamic";

function dateInput(d: Date | null | undefined): string {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

const fieldCls =
  "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";

function TenantFields({ tenant, rooms }: { tenant?: TenantWithRoom; rooms: Room[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm">
        Nom complet *
        <input name="fullName" required defaultValue={tenant?.fullName ?? ""} className={fieldCls} />
      </label>
      <label className="text-sm">
        Chambre
        <select name="roomId" defaultValue={tenant?.roomId ?? ""} className={fieldCls}>
          <option value="">— Aucune —</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Email
        <input name="email" type="email" defaultValue={tenant?.email ?? ""} className={fieldCls} />
      </label>
      <label className="text-sm">
        Téléphone
        <input name="phone" defaultValue={tenant?.phone ?? ""} className={fieldCls} />
      </label>
      <label className="text-sm">
        Date d&apos;entrée
        <input name="moveInDate" type="date" defaultValue={dateInput(tenant?.moveInDate)} className={fieldCls} />
      </label>
      <label className="text-sm">
        Date de sortie
        <input name="moveOutDate" type="date" defaultValue={dateInput(tenant?.moveOutDate)} className={fieldCls} />
      </label>
      <label className="text-sm">
        Dépôt de garantie (€)
        <input name="deposit" type="number" step="0.01" min="0" defaultValue={tenant?.deposit ?? 0} className={fieldCls} />
      </label>
      <label className="text-sm sm:col-span-2">
        Notes
        <textarea name="notes" rows={2} defaultValue={tenant?.notes ?? ""} className={fieldCls} />
      </label>
    </div>
  );
}

export default async function LocatairesPage() {
  const [tenants, rooms] = await Promise.all([getTenants(), getRooms()]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest-dark">Locataires</h1>
        <p className="text-sm text-muted">{tenants.length} locataire(s) enregistré(s)</p>
      </div>

      {/* Ajouter */}
      <details className="rounded-2xl bg-card shadow-sm ring-1 ring-line">
        <summary className="cursor-pointer list-none px-5 py-4 font-medium text-forest">
          ＋ Ajouter un locataire
        </summary>
        <form action={createTenant} className="space-y-4 border-t border-line px-5 py-4">
          <TenantFields rooms={rooms} />
          <button
            type="submit"
            className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-dark"
          >
            Enregistrer le locataire
          </button>
        </form>
      </details>

      {/* Liste */}
      {tenants.length === 0 ? (
        <p className="rounded-2xl bg-card p-8 text-center text-muted ring-1 ring-line">
          Aucun locataire pour le moment.
        </p>
      ) : (
        <div className="space-y-3">
          {tenants.map((t) => {
            const gone = t.moveOutDate && new Date(t.moveOutDate) < new Date();
            return (
              <div key={t.id} className="rounded-2xl bg-card shadow-sm ring-1 ring-line">
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink">{t.fullName}</span>
                      {gone ? (
                        <span className="rounded-full bg-line px-2 py-0.5 text-xs text-muted">Parti</span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          En cours
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted">
                      {t.room?.name ?? "Sans chambre"}
                      {t.email ? ` · ${t.email}` : ""}
                      {t.phone ? ` · ${t.phone}` : ""}
                    </p>
                    <p className="text-xs text-muted">
                      Entrée {dateFR(t.moveInDate)}
                      {t.moveOutDate ? ` → sortie ${dateFR(t.moveOutDate)}` : ""} · Dépôt {euros(t.deposit)}
                    </p>
                  </div>
                </div>
                <details className="border-t border-line">
                  <summary className="cursor-pointer list-none px-5 py-3 text-sm font-medium text-forest">
                    Éditer
                  </summary>
                  <form action={updateTenant} className="space-y-4 px-5 pb-5">
                    <input type="hidden" name="id" value={t.id} />
                    <TenantFields tenant={t} rooms={rooms} />
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-dark"
                      >
                        Mettre à jour
                      </button>
                    </div>
                  </form>
                  <form action={deleteTenant} className="border-t border-line px-5 py-3">
                    <input type="hidden" name="id" value={t.id} />
                    <button
                      type="submit"
                      className="text-sm text-red-600 transition hover:underline"
                    >
                      Supprimer ce locataire
                    </button>
                  </form>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
