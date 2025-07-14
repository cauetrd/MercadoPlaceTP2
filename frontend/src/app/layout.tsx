import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MercadoPlace",
  description: "Projeto Final de TP2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
