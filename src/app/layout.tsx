import type { Metadata } from "next";
import { Outfit } from 'next/font/google';
import "./globals.css";
import { Providers } from "@/providers";

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "Cosmic Nexus",
  description: "Cosmic Nexus is a platform where users can discover their cosmic ancestry, generate and mint unique DNA tokens based on cosmic radiation data, and participate in games and experiences powered by true randomness from space.",
  icons: {
    icon: "/favicon.png",
  },
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
