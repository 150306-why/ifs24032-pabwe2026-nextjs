"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { IconArticle, IconUser, IconUserCircle, IconUsers, IconX } from "@tabler/icons-react";

export const MENUS = [
  { href: "/", label: "Semua Postingan", icon: IconArticle, filter: "all" },
  { href: "/?filter=me", label: "Postingan Saya", icon: IconUserCircle, filter: "me" },
  { href: "/users", label: "Daftar Pengguna", icon: IconUsers, filter: null },
  { href: "/profile", label: "Profil Saya", icon: IconUser, filter: null },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SidebarComponent({ open, onClose }: Props) {
  const pathname = usePathname();
  const filter = useSearchParams().get("filter") === "me" ? "me" : "all";

  function isActive(href: string, menuFilter: string | null) {
    if (menuFilter) {
      return pathname === "/" && filter === menuFilter;
    }
    return pathname === href;
  }

  return (
    <>
      {open && (
        <div
          data-testid="sidebar-overlay"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}
      <aside
        data-testid="sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white p-4 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <span className="font-bold">Menu</span>
          <button type="button" aria-label="Tutup menu" onClick={onClose}>
            <IconX size={20} />
          </button>
        </div>
        <nav className="space-y-1">
          {MENUS.map(({ href, label, icon: Icon, filter: menuFilter }) => (
            <Link prefetch={false}
              key={label}
              href={href}
              onClick={onClose}
              aria-current={isActive(href, menuFilter) ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sky-50 hover:text-sky-700 ${
                isActive(href, menuFilter)
                  ? "bg-sky-50 text-sky-700"
                  : "text-slate-700"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
