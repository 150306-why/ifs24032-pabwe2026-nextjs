# Postingan (NextJS) — PABWE 2026 P4

Aplikasi Postingan: Next.js 16 (App Router) + TypeScript + Redux Toolkit + Tailwind 4 + SweetAlert2.

## Menjalankan
```bash
cp .env.example .env     # atur NEXT_PUBLIC_DELCOM_BASEURL & APP_PORT
bun install              # (npm: tambahkan --legacy-peer-deps, lalu
                         #  npm i --no-save vite @testing-library/dom)
bun run dev              # bun src/server.ts dev  -> port dari APP_PORT
bun run build && bun run start
bun run test             # vitest run --coverage (ambang 100%)
bun run lint
```

## Fitur
- Auth: register, login, logout, guard rute (client)
- Users: daftar pengguna + live search, profil, foto, kata sandi
- Postingan: linimasa, "Postingan Saya" (?filter=me), live search, tambah,
  detail, ubah, ubah cover, hapus, suka/batal suka, komentar (tambah/hapus
  milik sendiri), hapus semua postingan milik sendiri

## Catatan penting
- Dokumentasi endpoint Posts tidak dapat diakses saat pengerjaan. Bentuk body
  `POST /posts/:id/likes` ({type: "like"|"unlike"}) dan
  `DELETE /posts/:id/comments` ({comment_id}) adalah ASUMSI. Semuanya terpusat
  di `src/features/posts/api/postApi.ts`; sesuaikan di sana bila berbeda.
