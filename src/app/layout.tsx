import type { Metadata, Viewport } from "next";
import { Alice, Raleway, Montserrat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../components/LanguageProvider";
import { Analytics } from "../components/Analytics";

const alice = Alice({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-alice",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lunincocktailbar.com"),
  title: {
    default: "Lunin Cocktail Bar — Coctelería premium de autor",
    template: "%s · Lunin Cocktail Bar",
  },
  description:
    "Lunin Cocktail Bar — coctelería de autor en un ambiente premium. Carta digital de cócteles, signature, shots, spritz, licores y especiales. Reservas, eventos y DJ nights.",
  keywords: [
    "Lunin",
    "Lunin Cocktail Bar",
    "cocktail bar",
    "coctelería",
    "cocktails premium",
    "signature cocktails",
    "carta digital",
    "QR menu",
    "Lunin distillery",
  ],
  openGraph: {
    title: "Lunin Cocktail Bar",
    description:
      "Coctelería premium de autor. Carta digital, eventos, DJ nights y reservas.",
    url: "https://lunincocktailbar.com",
    siteName: "Lunin Cocktail Bar",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lunin Cocktail Bar",
    description: "Coctelería premium. Menú digital, eventos y reservas.",
  },
  alternates: {
    canonical: "/",
    languages: { es: "/?lang=es", en: "/?lang=en" },
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${alice.variable} ${raleway.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-lunin-black text-lunin-cream grain">
        <LanguageProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
