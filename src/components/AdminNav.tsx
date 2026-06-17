"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/locataires", label: "Locataires" },
  { href: "/admin/chambres", label: "Chambres" },
  { href: "/admin/loyers", label: "Loyers" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1">
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-forest text-white"
                : "text-muted hover:bg-forest/5 hover:text-forest"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
