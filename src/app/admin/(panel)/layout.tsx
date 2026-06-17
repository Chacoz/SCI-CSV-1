import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { siteConfig } from "@/lib/config";
import { AdminNav } from "@/components/AdminNav";
import { logout } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="font-display text-lg font-semibold text-forest-dark">
              {siteConfig.shortName}
            </Link>
            <span className="ml-2 text-sm text-muted">· gestion locative</span>
          </div>
          <div className="flex items-center gap-3">
            <AdminNav />
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-line px-3 py-1.5 text-sm text-muted transition hover:border-red-300 hover:text-red-600"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8">{children}</main>
    </div>
  );
}
