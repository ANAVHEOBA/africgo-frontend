import type { Metadata } from "next";
import RootLayoutClient from "./RootLayoutClient";
import "./globals.css";

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
      <body className="bg-white min-h-screen">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
