import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "GO BEYOND — Sport, Nutrition, Progression",
  description:
    "Programmes de sport (salle & maison), recettes, plans de repas et suivi de progression personnalisés.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GO BEYOND",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover", // handles iPhone notch / home-indicator safe areas
  themeColor: "#0d1210",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#0d1210] text-white antialiased min-h-screen">
        <LangProvider>{children}</LangProvider>
        {/* Registers the service worker so the app can be "installed" on phones.
            Also actively checks for a newer version on every load, and reloads
            once automatically when a new version takes over — this is what
            makes updates actually reach the phone instead of being stuck on
            an old cached version forever. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then((reg) => {
                    reg.update();
                  }).catch(() => {});
                });
                let refreshed = false;
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                  if (refreshed) return;
                  refreshed = true;
                  window.location.reload();
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
