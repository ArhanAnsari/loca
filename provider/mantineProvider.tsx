"use client";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

import { MantineProvider } from "@mantine/core";
import { Suspense } from "react";
import { SkeletonCard } from "@/components/loading";

export default function LocalMantineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<SkeletonCard />}>
          <MantineProvider>{children}</MantineProvider>
        </Suspense>
      </body>
    </html>
  );
}
