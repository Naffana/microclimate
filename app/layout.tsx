import type { ReactNode } from "react";
import Providers from "./providers";
import "./globals.css"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Микроклимат',
  icons: {
    icon: [
      { url: '/2.png', type: 'image/png' },
    ],
    apple: [
      { url: '/2.png' },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`h-full antialiased`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}