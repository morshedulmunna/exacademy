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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light' || (!theme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  // Fallback to dark mode if localStorage is not available
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`antialiased w-full min-h-screen relative`} style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
        <PageLoader />
        <SessionProvider>
          <LoadingProvider>
            <ThemeProvider>
              <AnimatedGridBackground gridSize={250} gridOpacity={0.3} waveFrequency={1000} waveIntensity={0.55} waveSpeed={0.5} />
              <CursorGlow />
              <TechLogosBackground />
              <main className="flex-1 relative z-10"> {children}</main>
            </ThemeProvider>
          </LoadingProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
