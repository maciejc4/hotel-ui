import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { HotelProvider } from "@hotel-ui/shared/contexts/HotelContext";
import { ToastProvider } from "@hotel-ui/shared/components/ui/toast";
import { I18nProvider } from "@hotel-ui/shared/i18n/I18nProvider";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "HotelConnect | Digital Concierge",
  description: "Your digital concierge and hotel companion.",
  manifest: "/hotel-ui/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HotelConnect",
  },
};

export const viewport: Viewport = {
  themeColor: "#e17055",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/hotel-ui/icons/icon-192.png" />
      </head>
      <body className={`${jakarta.variable} font-sans`}>
        <ServiceWorkerRegistrar />
        <I18nProvider>
          <HotelProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </HotelProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
