"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { IconMessageCircle } from "@tabler/icons-react";
import { useAppSelector } from "@/hooks/redux";
import { getAccessToken } from "@/helpers/apiHelper";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthLogin = useAppSelector((state) => state.isAuthLogin);

  useEffect(() => {
    if (isAuthLogin || getAccessToken()) {
      router.replace("/");
    }
  }, [isAuthLogin, router]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside
        data-testid="auth-banner"
        className="hidden flex-col justify-center gap-6 bg-gradient-to-br from-sky-700 to-blue-900 p-12 text-white lg:flex"
      >
        <IconMessageCircle size={56} stroke={1.5} aria-hidden="true" />
        <p className="text-4xl font-extrabold leading-tight">Postingan</p>
        <p className="max-w-md text-sky-50">
          Bagikan cerita, beri suka, dan berdiskusi lewat komentar bersama
          pengguna lainnya.
        </p>
      </aside>
      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          {children}
        </div>
      </main>
    </div>
  );
}
