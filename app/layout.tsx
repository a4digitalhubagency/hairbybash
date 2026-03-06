import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "800"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: "400",
});

export const metadata: Metadata = {
  title: "HairbyBash — Calgary Braider & Loctician",
  description:
    "Elevating your crown with precision braids and loc maintenance. Experience luxury hair care tailored specifically to you.",
  icons: {
    icon: '/images/hairbybashlogo-removebg-preview.png',
    apple: '/images/hairbybashlogo-removebg-preview.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} antialiased bg-dark text-white`}
      >
        {children}
      </body>
    </html>
  );
}
