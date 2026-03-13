import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { HotelProvider } from "@hotel-ui/shared/contexts/HotelContext";
import { ToastProvider } from "@hotel-ui/shared/components/ui/toast";
import { I18nProvider } from "@hotel-ui/shared/i18n/I18nProvider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "HotelConnect Admin",
  description: "Hotel staff management panel.",
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
