import type { Metadata, Viewport } from "next";
import { Alice, Raleway, Montserrat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../components/LanguageProvider";
import { Analytics } from "../components/Analytics";
import { StructuredData } from "../components/StructuredData";

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
    default: "Lunin Cocktail Bar · Coctelería de autor en Russafa, Valencia",
    template: "%s · Lunin Cocktail Bar Valencia",
  },
  description:
    "Coctelería de autor en Russafa (Valencia). Cócteles signature, spritz y destilados craft propios — horilka, brandies de fruta y gin. Reservas, eventos privados y noches con carácter. Calle Puerto Rico 4.",
  keywords: [
    "cocktail bar Valencia",
    "coctelería Valencia",
    "coctelería Russafa",
    "coctelería Ruzafa",
    "cocktail bar Russafa",
    "coctelería de autor Valencia",
    "cócteles Valencia",
    "mejores cocktails Valencia",
    "bar de copas Russafa",
    "eventos privados Valencia coctelería",
    "Lunin Cocktail Bar",
    "Lunin distillery",
    "horilka Valencia",
    "destilados craft Valencia",
  ],
  openGraph: {
    title: "Lunin Cocktail Bar · Coctelería de autor en Russafa, Valencia",
    description:
      "Cócteles de autor y destilados craft propios en el corazón de Russafa. Distilled with Soul, Served with Love.",
    url: "https://lunincocktailbar.com",
    siteName: "Lunin Cocktail Bar",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lunin Cocktail Bar — Coctelería de autor en Russafa, Valencia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lunin Cocktail Bar · Russafa, Valencia",
    description:
      "Coctelería de autor y destilados craft en el corazón de Russafa, Valencia.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
    languages: { es: "/?lang=es", en: "/?lang=en", uk: "/?lang=uk" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
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
        <StructuredData />
      </body>
    </html>
  );
}
