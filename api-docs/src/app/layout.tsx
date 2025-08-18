import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { DocsProvider } from "@/components/docs-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Execute Academy API Documentation",
  description: "Comprehensive API documentation for Execute Academy platform",
  keywords: ["API", "documentation", "Execute Academy", "REST", "endpoints"],
  authors: [{ name: "Execute Academy Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DocsProvider>{children}</DocsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
