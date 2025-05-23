import type { Metadata } from "next";
import "../assets/styles/globals.css";
import { ThemeProvider } from "@/themes/ThemeProvider";

export const metadata: Metadata = {
  title: "Morshedul Islam Munna - Software Engineer",
  description: " Software Engineer with a passion for building scalable and efficient systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased w-full min-h-screen bg-black text-white relative`}>
        <main className="flex-1 relative z-10"> {children}</main>
      </body>
    </html>
  );
}
