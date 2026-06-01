// JSON-LD structured data for local SEO (Google rich results / local pack).
// Coordenadas y datos NAP — verifica/ajusta con los reales antes de producción.
const data = {
  "@context": "https://schema.org",
  "@type": "BarOrPub",
  "@id": "https://lunincocktailbar.com/#business",
  name: "Lunin Cocktail Bar",
  alternateName: "Lunin Coctelería",
  description:
    "Coctelería de autor en Russafa (Valencia) con destilados craft propios. Cócteles signature, spritz, horilka y brandies de fruta.",
  url: "https://lunincocktailbar.com",
  image: "https://lunincocktailbar.com/og-image.jpg",
  logo: "https://lunincocktailbar.com/icon.svg",
  telephone: "+34655147944",
  email: "Lunindistillery@gmail.com",
  priceRange: "€€",
  servesCuisine: ["Cócteles", "Coctelería de autor"],
  currenciesAccepted: "EUR",
  paymentAccepted: "Efectivo, Tarjeta",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Puerto Rico 4",
    addressLocality: "Valencia",
    addressRegion: "Comunidad Valenciana",
    postalCode: "46006",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 39.4575,
    longitude: -0.3745,
  },
  areaServed: { "@type": "City", name: "Valencia" },
  hasMap: "https://maps.google.com/?q=Lunin+Cocktail+Bar+Calle+Puerto+Rico+4+Valencia",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "18:00",
      closes: "01:00",
    },
  ],
  // Perfiles oficiales (añade Google Business / TripAdvisor cuando los tengas):
  sameAs: ["https://instagram.com/luninbar"],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
