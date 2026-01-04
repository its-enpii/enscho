import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeRegistry } from "@/components/ThemeRegistry";
import { getSchoolConfig } from "@/services/school";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SMK Enscho - Sekolah Pusat Keunggulan",
  description: "Website resmi SMK Enscho. Siap kerja, santun, mandiri, dan kreatif.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSchoolConfig();
  return (
    <html lang="id">
      <body className={inter.className}>
        <ThemeRegistry primaryColor={config.primaryColor || "#2563eb"} />
        {children}
      </body>
    </html>
  );
}
