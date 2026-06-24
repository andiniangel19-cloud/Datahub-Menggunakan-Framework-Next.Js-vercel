import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataHub",
  description: "Platform kolaborasi data sains",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Kita biarkan kosong di sini karena Navbar-nya sudah ada di page.tsx */}
        {children}
      </body>
    </html>
  );
}