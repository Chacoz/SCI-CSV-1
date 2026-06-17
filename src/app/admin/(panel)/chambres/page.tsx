import { getRooms, type Room } from "@/lib/data";
import { euros } from "@/lib/format";
import { createRoom, updateRoom, deleteRoom } from "../../actions";

export const dynamic = "force-dynamic";

const fieldCls =
  "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15";

function RoomFields({ room }: { room?: Room }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm">
        Nom *
        <input name="name" required defaultValue={room?.name ?? ""} className={fieldCls} />
      </label>
      <label className="text-sm">
        Surface (m²)
        <input name="surface" type="number" step="0.5" min="0" defaultValue={room?.surface ?? ""} className={fieldCls} />
      </label>
      <label className="text-sm">
        Loyer mensuel HC (€)
        <input name="rent" type="number" step="0.01" min="0" defaultValue={room?.rent ?? 0} className={fieldCls} />
      </label>
      <label className="text-sm">
        Provision charges (€)
        <input name="charges" type="number" step="0.01" min="0" defaultValue={room?.charges ?? 0} className={fieldCls} />
      </label>
      <label className="text-sm sm:col-span-2">
        Photo (URL ou chemin, ex. /photos/chambre-1.jpg)
        <input name="photoUrl" defaultValue={room?.photoUrl ?? ""} className={fieldCls} />
      </label>
      <label className="text-sm sm:col-span-2">
        Description (vitrine)
        <textarea name="description" rows={2} defaultValue={room?.description ?? ""} className={fieldCls} />
      </label>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input
          name="available"
          type="checkbox"
          defaultChecked={room?.available ?? false}
          className="h-4 w-4 rounded border-line text-forest focus:ring-forest"
        />
        Afficher comme disponible sur la vitrine
      </label>
    </div>
  );
}

export default async function ChambresPage() {
  const rooms = await getRooms();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest-dark">Chambres</h1>
        <p className="text-sm text-muted">{rooms.length} chambre(s)</p>
      </div>

      <details className="rounded-2xl bg-card shadow-sm ring-1 ring-line">
        <summary className="cursor-pointer list-none px-5 py-4 font-medium text-forest">
          ＋ Ajouter une chambre
        </summary>
        <form action={createRoom} className="space-y-4 border-t border-line px-5 py-4">
          <RoomFields />
          <button
            type="submit"
            className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-dark"
          >
            Créer la chambre
          </button>
        </form>
      </details>

      <div className="space-y-3">
        {rooms.map((room) => (
          <div key={room.id} className="rounded-2xl bg-card shadow-sm ring-1 ring-line">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink">{room.name}</span>
                  {room.available ? (
                    <span className="rounded-full bg-ochre/20 px-2 py-0.5 text-xs font-medium text-ochre-dark">
                      Disponible
                    </span>
                  ) : (
                    <span className="rounded-full bg-line px-2 py-0.5 text-xs text-muted">Occupée</span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted">
                  {euros(room.rent)} HC
                  {room.charges ? ` + ${euros(room.charges)} charges = ${euros(room.rent + room.charges)} CC` : " (charges à renseigner)"}
                  {room.surface ? ` · ${room.surface} m²` : ""}
                </p>
              </div>
            </div>
            <details className="border-t border-line">
              <summary className="cursor-pointer list-none px-5 py-3 text-sm font-medium text-forest">
                Éditer
              </summary>
              <form action={updateRoom} className="space-y-4 px-5 pb-5">
                <input type="hidden" name="id" value={room.id} />
                <RoomFields room={room} />
                <button
                  type="submit"
                  className="rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-dark"
                >
                  Mettre à jour
                </button>
              </form>
              <form action={deleteRoom} className="border-t border-line px-5 py-3">
                <input type="hidden" name="id" value={room.id} />
                <button type="submit" className="text-sm text-red-600 transition hover:underline">
                  Supprimer cette chambre
                </button>
              </form>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
