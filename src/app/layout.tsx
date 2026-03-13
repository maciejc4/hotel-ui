import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { HotelProvider } from "@/contexts/HotelContext";
import { ToastProvider } from "@/components/ui/toast";
import { I18nProvider } from "@/i18n/I18nProvider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "HotelConnect | Digital Concierge",
  description: "Your digital concierge and hotel companion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans`}>
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
