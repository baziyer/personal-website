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
  title: "Baz Iyer - Founder, Product & Data Leader",
  description: "I build things and help teams ship, learn and decide fast. Product leadership, data strategy, and team coaching.",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Baz Iyer - Founder, Product & Data Leader",
    description: "I build things and help teams ship, learn and decide fast. Product leadership, data strategy, and team coaching.",
    images: [
      {
        url: '/open graph.png',
        width: 1200,
        height: 630,
        alt: 'Baz Iyer - Founder, Product & Data Leader',
      },
    ],
    type: 'website',
    siteName: 'Baz Iyer',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Baz Iyer - Founder, Product & Data Leader",
    description: "I build things and help teams ship, learn and decide fast. Product leadership, data strategy, and team coaching.",
    images: ['/open graph.png'],
  },
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
