"use client";

import "./globals.css";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BottomBar from "@/components/BottomBar";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <HeroUIProvider>
            <QueryClientProvider client={queryClient}>
              {children}
              <BottomBar />
            </QueryClientProvider>
          </HeroUIProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
