import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { siteConfig } from "@/lib/config";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-sm ring-1 ring-line">
        <h1 className="font-display text-2xl font-semibold text-forest-dark">Espace gestion</h1>
        <p className="mt-1 text-sm text-muted">{siteConfig.name}</p>
        <LoginForm />
      </div>
    </main>
  );
}
