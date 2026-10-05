"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconLogout, IconMenu2, IconMessageCircle } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetIsAuthLogout } from "@/features/auth/states/action";

interface Props {
  onToggleSidebar: () => void;
}

export default function NavbarComponent({ onToggleSidebar }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const profile = useAppSelector((state) => state.profile);
  const [open, setOpen] = useState(false);

  function handleLogout() {
    dispatch(asyncSetIsAuthLogout());
    router.push("/auth/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Buka menu"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
        >
          <IconMenu2 size={22} />
        </button>
        <Link prefetch={false} href="/" className="flex items-center gap-2 font-extrabold text-sky-700">
          <IconMessageCircle size={24} />
          <span>Postingan</span>
        </Link>
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label="Menu profil"
          onClick={() => setOpen((value) => !value)}
          className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100"
        >
          <span className="hidden text-sm font-medium sm:block">
            {profile ? profile.name : "Pengguna"}
          </span>
          {profile && profile.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photo}
              alt="Avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-700 text-sm font-bold text-white">
              {profile && profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
            </span>
          )}
        </button>

        {open && (
          <div
            data-testid="profile-dropdown"
            className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
          >
            <Link prefetch={false}
              href="/profile"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100"
            >
              Profil Saya
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <IconLogout size={16} /> Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
