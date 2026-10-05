import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Postingan",
  description: "Aplikasi Postingan berbasis NextJS & Delcom API",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Google Fonts: Plus Jakarta Sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Root layout berlaku untuk semua halaman, jadi aturan ini aman dinonaktifkan */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
