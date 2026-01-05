import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeRegistry } from "@/components/ThemeRegistry";
import { getSchoolConfig } from "@/services/school";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSchoolConfig();
  const slogan = config.slogan ? ` - ${config.slogan}` : "";

  return {
    title: `${config.name}${slogan}`,
    description: config.footerDescription || "Website resmi sekolah.",
    icons: {
      icon: [
        { url: config.logoUrl || "/favicon.ico" },
        { url: config.logoUrl || "/favicon.ico", sizes: "32x32" },
      ],
      shortcut: config.logoUrl || "/favicon.ico",
      apple: config.logoUrl || "/favicon.ico",
    },
  };
}

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
