import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dar Ismail — Cuisine Marocaine Authentique",
  description: "Commandez vos tajines, couscous, briwat et salades marocains à Marrakech. Livraison rapide 15–25 DH.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Dar Ismail",
    statusBarStyle: "default",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <head>
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="min-h-full bg-gray-100 lg:bg-white">
        <CartProvider>
          {/* Mobile: phone-frame container. Desktop: full width */}
          <div className="mx-auto w-full max-w-[430px] lg:max-w-none bg-white min-h-screen relative shadow-[0_0_40px_rgba(0,0,0,0.15)] lg:shadow-none">
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
