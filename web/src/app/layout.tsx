import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const clashGrotesk = localFont({
  variable: "--font-clash",
  src: [
    { path: "../../public/fonts/TTF/ClashGrotesk-Variable.ttf", style: "normal", weight: "100 900" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Baz Iyer - Fractional CPO & Product/Data Advisor",
  description: "I help teams ship, learn, and decide with data & AI. Fractional CPO, product coaching, and data/AI advisory services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${clashGrotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
