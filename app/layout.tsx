import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loca",
  description: "Instantly connect with Local Expert",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children} <Toaster position="top-right"/></body>
    </html>
  );
}
