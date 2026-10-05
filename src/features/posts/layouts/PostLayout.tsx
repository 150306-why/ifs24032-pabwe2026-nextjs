"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getAccessToken } from "@/helpers/apiHelper";
import { asyncSetProfile } from "@/features/users/states/action";
import { asyncSetIsAuthLogout } from "@/features/auth/states/action";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

export default function PostLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isProfile = useAppSelector((state) => state.isProfile);
  const isAuthLogout = useAppSelector((state) => state.isAuthLogout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/auth/login");
      return;
    }

    dispatch(asyncSetProfile()).then((ok) => {
      if (!ok) {
        dispatch(asyncSetIsAuthLogout());
        router.replace("/auth/login");
      }
    });
  }, [dispatch, router, isAuthLogout]);

  if (!isProfile) {
    return (
      <main className="flex min-h-screen items-center justify-center text-slate-600">
        Memuat sesi...
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      <NavbarComponent onToggleSidebar={() => setSidebarOpen((value) => !value)} />
      <div className="flex">
        <SidebarComponent open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
