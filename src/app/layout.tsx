import type { Metadata } from "next";
import { Outfit } from 'next/font/google';
import "./globals.css";

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "True Cosmic Ancestry",
  description: "Discover your celestial heritage through the cosmic elements that shaped your existence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
