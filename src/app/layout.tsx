import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RootLayoutClient from "./RootLayoutClient";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AfricGo",
  description: "Your Premier African Marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-primary min-h-screen`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
