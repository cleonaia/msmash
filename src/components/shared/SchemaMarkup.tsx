import Script from "next/script";
import { siteConfig } from "@/config/site";

export function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteConfig.name,
    image: "https://msmashburger.page/og-image.png",
    description:
      "Smash burgers auténticos de fuego. Carne aplastada al momento, queso fundido hasta los bordes.",
    url: "https://msmashburger.page",
    telephone: "",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Carrer del Col·legi, 5",
      addressLocality: "Terrassa",
      addressRegion: "Barcelona",
      postalCode: "08221",
      addressCountry: "ES",
    },
    sameAs: ["https://www.instagram.com/smashburgerbcn"],
    priceRange: "€€",
    cuisineType: "American",
    potentialAction: {
      "@type": "OrderAction",
      target: "https://msmashburger.page/pedidos",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "200",
    },
  };

  return (
    <Script
      id="schema-markup"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}
