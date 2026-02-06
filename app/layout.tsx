import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Taboulou ERP | Gestion Professionnelle",
  description: "Système ERP moderne inspiré d'Odoo pour la gestion de stock, caisse et RH.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased font-inter bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
