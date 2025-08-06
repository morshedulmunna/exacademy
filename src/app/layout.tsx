import type { Metadata } from "next";
import "@/assets/styles/globals.css";
import { ThemeProvider } from "@/themes/ThemeProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import AnimatedGridBackground from "@/common/Effect/animated-grid-background";
import CursorGlow from "@/common/Effect/CursorGlow";
import CursorLaser from "@/common/Effect/CursorLaser";
import TechLogosBackground from "@/common/Effect/tech-logos-background";
import { PageLoader } from "@/components/ui/PageLoader";
import { RouteLoader } from "@/components/ui/RouteLoader";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

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
      <body className={`antialiased w-full min-h-screen bg-white dark:bg-black text-black dark:text-white relative`}>
        <PageLoader />
        <RouteLoader />
        <SessionProvider>
          <LoadingProvider>
            <ThemeProvider>
              <AnimatedGridBackground gridSize={250} gridOpacity={0.3} waveFrequency={1000} waveIntensity={0.55} waveSpeed={0.5} />
              <CursorGlow />
              <TechLogosBackground />
              <GlobalLoader />
              <main className="flex-1 relative z-10"> {children}</main>
            </ThemeProvider>
          </LoadingProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
