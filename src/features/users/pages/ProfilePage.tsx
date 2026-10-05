"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useInput from "@/hooks/useInput";
import {
  asyncSetIsChangeProfile,
  asyncSetIsChangeProfilePassword,
  asyncSetIsChangeProfilePhoto,
} from "../states/action";
import { showWarningDialog } from "@/helpers/toolsHelper";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);
  const isChangeProfile = useAppSelector((state) => state.isChangeProfile);
  const isChangePhoto = useAppSelector((state) => state.isChangeProfilePhoto);
  const isChangePassword = useAppSelector((state) => state.isChangeProfilePassword);
  const [name, onNameChange] = useInput(profile ? profile.name : "");
  const [email, onEmailChange] = useInput(profile ? profile.email : "");
  const [password, onPasswordChange, setPassword] = useInput("");
  const [newPassword, onNewPasswordChange, setNewPassword] = useInput("");
  const [photo, setPhoto] = useState<File | null>(null);

  function handleProfile(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) {
      showWarningDialog("Nama dan email wajib diisi.");
      return;
    }
    dispatch(asyncSetIsChangeProfile({ name, email }));
  }

  async function handlePhoto(event: FormEvent) {
    event.preventDefault();
    if (!photo) {
      showWarningDialog("Pilih foto terlebih dahulu.");
      return;
    }
    const ok = await dispatch(asyncSetIsChangeProfilePhoto(photo));
    if (ok) setPhoto(null);
  }

  async function handlePassword(event: FormEvent) {
    event.preventDefault();
    if (!password || !newPassword) {
      showWarningDialog("Kata sandi lama dan baru wajib diisi.");
      return;
    }
    const ok = await dispatch(
      asyncSetIsChangeProfilePassword({ password, newPassword })
    );
    if (ok) {
      setPassword("");
      setNewPassword("");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Profil Saya</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-4">
          {profile && profile.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photo}
              alt="Foto profil"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-700 text-xl font-bold text-white">
              {profile ? profile.name.charAt(0).toUpperCase() : "?"}
            </span>
          )}
          <form onSubmit={handlePhoto} className="flex flex-wrap items-center gap-2">
            <label htmlFor="photo" className="text-sm font-medium">
              Foto
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
              className="text-sm"
            />
            <button
              type="submit"
              disabled={isChangePhoto}
              className="rounded-lg bg-sky-700 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isChangePhoto ? "Mengunggah..." : "Unggah Foto"}
            </button>
          </form>
        </div>
      </section>

      <form
        onSubmit={handleProfile}
        className="space-y-3 rounded-xl border border-slate-200 bg-white p-5"
      >
        <h2 className="font-semibold">Informasi Profil</h2>
        <div>
          <label htmlFor="profile-name" className="mb-1 block text-sm font-medium">
            Nama
          </label>
          <input
            id="profile-name"
            value={name}
            onChange={onNameChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="profile-email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={onEmailChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={isChangeProfile}
          className="rounded-lg bg-sky-700 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {isChangeProfile ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </form>

      <form
        onSubmit={handlePassword}
        className="space-y-3 rounded-xl border border-slate-200 bg-white p-5"
      >
        <h2 className="font-semibold">Ubah Kata Sandi</h2>
        <div>
          <label htmlFor="old-password" className="mb-1 block text-sm font-medium">
            Kata Sandi Lama
          </label>
          <input
            id="old-password"
            type="password"
            value={password}
            onChange={onPasswordChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="new-password" className="mb-1 block text-sm font-medium">
            Kata Sandi Baru
          </label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={onNewPasswordChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={isChangePassword}
          className="rounded-lg bg-sky-700 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {isChangePassword ? "Menyimpan..." : "Ubah Kata Sandi"}
        </button>
      </form>
    </div>
  );
}
