import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
import "./globals.css";

/**
 * Font di-host sendiri (paket @fontsource-variable, subset latin, variable
 * weight 200-800). Tidak ada request ke Google Fonts dan tidak ada stylesheet
 * eksternal yang memblokir render; Next.js otomatis melakukan preload font.
 */
const jakarta = localFont({
  src: "../../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Postingan",
  description: "Aplikasi Postingan berbasis NextJS & Delcom API",
  icons: { icon: "/logo.svg" },
};

/**
 * Guard ringan sebelum hidrasi: pengguna tanpa token yang membuka halaman
 * dashboard langsung dialihkan ke /auth/login, sehingga bundle dashboard
 * tidak perlu diunduh dan dieksekusi dulu. Guard di PostLayout tetap menjadi
 * pengaman utama (validasi token ke API).
 */
const EARLY_AUTH_GUARD = `(function(){try{if(!localStorage.getItem("accessToken")&&location.pathname.indexOf("/auth")!==0){location.replace("/auth/login")}}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={jakarta.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: EARLY_AUTH_GUARD }} />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
