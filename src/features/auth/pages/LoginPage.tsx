"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useInput from "@/hooks/useInput";
import { useAppDispatch } from "@/hooks/redux";
import { asyncSetIsAuthLogin } from "../states/action";
import { showWarningDialog } from "@/helpers/toolsHelper";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!email.trim() || !password) {
      showWarningDialog("Email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);
    const ok = await dispatch(asyncSetIsAuthLogin({ email, password }));
    setLoading(false);

    if (ok) {
      router.push("/");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Masuk</h1>
        <p className="text-sm text-slate-600">Silakan masuk untuk melanjutkan.</p>
      </div>
      <div>
        <label htmlFor="login-email-input" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="login-email-input"
          type="email"
          value={email}
          onChange={onEmailChange}
          placeholder="nama@email.com"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
        />
      </div>
      <div>
        <label htmlFor="login-password-input" className="mb-1 block text-sm font-medium">
          Kata Sandi
        </label>
        <input
          id="login-password-input"
          type="password"
          value={password}
          onChange={onPasswordChange}
          placeholder="••••••••"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-sky-500"
        />
      </div>
      <button
        id="login-submit-button"
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-sky-700 py-2.5 font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
      >
        {loading ? "Memproses..." : "Masuk"}
      </button>
      <p className="text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link prefetch={false} href="/auth/register" className="font-semibold text-sky-700">
          Daftar
        </Link>
      </p>
    </form>
  );
}
