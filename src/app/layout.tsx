import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aethrix - The Tiena-Nueble Chronicles",
  description: "A dark and gritty terminal RPG. The empire spans far. But not far enough.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen selection:bg-aethrix-gold selection:text-black">
        {children}
      </body>
    </html>
  );
}
