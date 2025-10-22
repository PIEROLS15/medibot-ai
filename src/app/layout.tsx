import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import AppWrapper from "@/components/AppWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nameSystem = process.env.NEXT_PUBLIC_NAME || "Nombre del sistema";
const descriptionSystem =
  process.env.NEXT_PUBLIC_DESCRIPTION || "Descripción del sistema";

export const metadata: Metadata = {
  title: nameSystem,
  description: descriptionSystem,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <AppWrapper>{children}</AppWrapper>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
