import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lunin Cocktail Bar",
    short_name: "Lunin",
    description:
      "Coctelería de autor en Russafa, Valencia. Cócteles signature y destilados craft propios.",
    start_url: "/",
    display: "standalone",
    background_color: "#0E120F",
    theme_color: "#1E4034",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
