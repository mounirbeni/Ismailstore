import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dar Ismail — Authentic Moroccan Cuisine",
  description: "Order traditional Moroccan tagines, couscous, briwat and salads from Dar Ismail restaurant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-300 flex flex-col">
        <CartProvider>
          <div className="mx-auto w-full max-w-[430px] bg-gray-50 min-h-screen relative overflow-x-hidden shadow-[0_0_60px_rgba(0,0,0,0.25)]">
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
