import type { Metadata } from "next";
import { Manrope } from 'next/font/google'
import { cn } from '@/lib/utils'
import "./globals.css";
import { Toaster } from "react-hot-toast";
import LocalMantineProvider from "@/provider/mantineProvider";

const fontHeading = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

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
      <body className={cn(
        'antialiased',
        fontHeading.variable,
        fontBody.variable
      )} suppressHydrationWarning>
        <LocalMantineProvider>
          {children} <Toaster position="top-right" />
        </LocalMantineProvider>
      </body>
    </html>
  );
}
