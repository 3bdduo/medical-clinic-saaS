import type { Metadata, Viewport } from "next";
import { Cairo, Manrope } from "next/font/google";
import "./globals.css";
import { themeInitScript } from "@/lib/themeInitScript";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { Preloader } from "@/components/Preloader";
import { AmbientBackground } from "@/components/AmbientBackground";

// Cairo: Arabic + Latin, calm geometric shapes fit a clinical/medical tone.
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "optional", // avoid FOUT entirely per the "preload, never flash" brief
});

// Manrope: a slightly more distinctive display face for headings (Latin only,
// falls back to Cairo automatically for Arabic headings).
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "optional",
});

export const metadata: Metadata = {
  title: "نبض | Nabd — منصة إدارة العيادات الطبية",
  description: "منصة نبض (Nabd SaaS) المتطورة لإدارة العيادات الطبية — مواعيد، مرضى، وسجلات طبية. Your Pulse, Our Care.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F9FA" },
    { media: "(prefers-color-scheme: dark)", color: "#12181A" },
  ],
};

import { ThemeToggle } from "@/components/ThemeToggle";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${manrope.variable}`}>
      <head>
        {/* Blocking script: applies the correct theme class before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <AuthProvider>
            <AmbientBackground />
            <Preloader>{children}</Preloader>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
