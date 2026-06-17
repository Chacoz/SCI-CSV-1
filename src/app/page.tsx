import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { getPublicRooms } from "@/lib/data";
import { euros } from "@/lib/format";
import { PhotoBox } from "@/components/PhotoBox";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rooms = await getPublicRooms();
  const available = rooms.filter((r) => r.available);
  const mailtoBase = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
    `Intéressé(e) par une chambre — ${siteConfig.name}`,
  )}`;

  return (
    <div className="flex flex-col">
      {/* En-tête */}
      <header className="sticky top-0 z-30 border-b border-line bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="font-display text-xl font-semibold text-forest-dark">
            {siteConfig.shortName}
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a href="#le-bien" className="hover:text-forest">Le bien</a>
            <a href="#chambres" className="hover:text-forest">Chambres</a>
            <a href="#contact" className="hover:text-forest">Contact</a>
          </nav>
          <Link
            href="/admin"
            className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-forest transition hover:bg-forest hover:text-white"
          >
            Espace gestion
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
        <div>
          {available.length > 0 && (
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-ochre/15 px-3 py-1 text-sm font-medium text-ochre-dark">
              <span className="h-2 w-2 rounded-full bg-ochre" />
              {available.length} chambre{available.length > 1 ? "s" : ""} disponible
              {available.length > 1 ? "s" : ""}
            </span>
          )}
          <h1 className="font-display text-4xl font-semibold leading-tight text-forest-dark md:text-5xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">{siteConfig.intro}</p>
          <p className="mt-4 text-sm font-medium text-forest">
            📍 {siteConfig.address}, {siteConfig.postalCode} {siteConfig.city}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#chambres"
              className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-dark"
            >
              Voir les chambres
            </a>
            <a
              href="#contact"
              className="rounded-full border border-forest/30 px-6 py-3 text-sm font-semibold text-forest transition hover:bg-forest/5"
            >
              Nous contacter
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PhotoBox label="Façade" className="col-span-2 h-56 w-full rounded-2xl md:h-72" />
          <PhotoBox label="Salon" className="h-36 w-full rounded-2xl" />
          <PhotoBox label="Cuisine" className="h-36 w-full rounded-2xl" />
        </div>
      </section>

      {/* Points forts */}
      <section id="le-bien" className="border-y border-line bg-card/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.highlights.map((h) => (
            <div key={h.title} className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-line">
              <div className="text-3xl">{h.icon}</div>
              <h3 className="mt-3 font-display text-lg font-semibold text-forest-dark">{h.title}</h3>
              <p className="mt-1 text-sm text-muted">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chambres */}
      <section id="chambres" className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-semibold text-forest-dark">Les chambres</h2>
          <p className="mt-2 text-muted">
            6 chambres meublées, charges et internet compris dans le loyer.
          </p>
        </div>

        {rooms.length === 0 ? (
          <p className="rounded-2xl bg-card p-8 text-center text-muted ring-1 ring-line">
            Les chambres seront bientôt présentées ici.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <article
                key={room.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-line"
              >
                <div className="relative">
                  <PhotoBox src={room.photoUrl} label={room.name} alt={room.name} className="h-44 w-full" />
                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                      room.available ? "bg-ochre text-white" : "bg-forest-dark/80 text-white"
                    }`}
                  >
                    {room.available ? "Disponible" : "Occupée"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-lg font-semibold text-forest-dark">{room.name}</h3>
                    {room.surface ? (
                      <span className="text-sm text-muted">{room.surface} m²</span>
                    ) : null}
                  </div>
                  {room.description ? (
                    <p className="mt-2 flex-1 text-sm text-muted">{room.description}</p>
                  ) : (
                    <div className="flex-1" />
                  )}
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-lg font-semibold text-forest">
                      {euros(room.rent + room.charges)}
                      <span className="text-sm font-normal text-muted">
                        {" "}/mois {room.charges > 0 ? "CC" : "HC"}
                      </span>
                    </span>
                    {room.available && (
                      <a
                        href={`${mailtoBase}%20(${encodeURIComponent(room.name)})`}
                        className="rounded-full bg-forest px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-forest-dark"
                      >
                        Je suis intéressé(e)
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-line bg-forest-dark text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h2 className="font-display text-3xl font-semibold">Une chambre vous intéresse ?</h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">
            Écrivez-nous pour organiser une visite ou poser vos questions.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={mailtoBase}
              className="rounded-full bg-ochre px-6 py-3 text-sm font-semibold text-white transition hover:bg-ochre-dark"
            >
              ✉️ {siteConfig.contactEmail}
            </a>
            {siteConfig.contactPhone && (
              <a
                href={`tel:${siteConfig.contactPhone.replace(/\s/g, "")}`}
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                📞 {siteConfig.contactPhone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="bg-forest-dark/95 text-white/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-sm sm:flex-row">
          <span>
            © {siteConfig.name} — {siteConfig.address}, {siteConfig.city}
          </span>
          <Link href="/admin" className="hover:text-white">
            Espace gestion
          </Link>
        </div>
      </footer>
    </div>
  );
}
