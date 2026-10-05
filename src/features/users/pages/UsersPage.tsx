"use client";

import { useEffect, useMemo, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetUsers } from "../states/action";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    dispatch(asyncSetUsers());
  }, [dispatch]);

  const visible = useMemo(() => {
    const key = keyword.trim().toLowerCase();
    if (!key) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(key) ||
        user.email.toLowerCase().includes(key)
    );
  }, [users, keyword]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Daftar Pengguna</h1>

      <div className="relative">
        <IconSearch size={16} className="absolute left-3 top-3 text-slate-600" />
        <input
          aria-label="Cari pengguna"
          placeholder="Cari nama atau email..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3"
        />
      </div>

      {visible.length === 0 ? (
        <p className="text-slate-600">Tidak ada pengguna.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              {user.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photo}
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-700 font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold">{user.name}</p>
                <p className="truncate text-sm text-slate-600">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
