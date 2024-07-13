"use client"
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';

export default function LocalMantineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <ColorSchemeScript />
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}