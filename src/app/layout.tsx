import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { HotelProvider } from "@/contexts/HotelContext";
import { ToastProvider } from "@/components/ui/toast";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
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
    <html lang="en">
      <body className={`${jakarta.variable} font-sans`}>
        <HotelProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </HotelProvider>
      </body>
    </html>
  );
}
