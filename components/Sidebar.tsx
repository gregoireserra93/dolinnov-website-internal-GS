"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Radar,
  FlaskConical,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/veille", label: "Veille", icon: Radar },
  { href: "/data", label: "Données scientifiques", icon: FlaskConical },
  { href: "/parametres", label: "Paramètres", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-dolinnov-black text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-dolinnov-green flex items-center justify-center">
            <span className="text-dolinnov-black font-bold text-lg">D</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">Dolinnov</span>
        </Link>
        <p className="text-xs text-white/40 mt-2 ml-10">Outil interne</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-dolinnov-green text-dolinnov-black"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-xs text-white/40">
        <p className="font-medium text-white/60">Grégoire Serra</p>
        <p>CEO &middot; Dolinnov SAS</p>
      </div>
    </aside>
  );
}
