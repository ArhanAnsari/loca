import { Nav } from "@/components/nav";
import Sidebar from "@/components/sidebar";
import type { Metadata } from "next";
import { MantineProvider } from "@mantine/core";
import { Suspense } from "react";
import { SkeletonCard } from "@/components/loading";

export const metadata: Metadata = {
  title: "Chat with Loca",
  description: "Instantly connect with Local Expert",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
      <Suspense fallback={<SkeletonCard />}>
      <MantineProvider>
        <div className="flex h-[100vh]">
          <div className="hidden lg:block ">
            <Sidebar />
          </div>

          <div className="flex-1  bg-black overflow-hidden">
            <Nav />
            <div className="mt-8">{children}</div>
          </div>
        </div>
        </MantineProvider>
        </Suspense>
      </body>
    </html>
  );
}
