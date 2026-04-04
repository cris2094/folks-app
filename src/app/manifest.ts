import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Irawa",
    short_name: "Irawa",
    description: "Gestión Residencial Inteligente",
    start_url: "/home",
    display: "standalone",
    background_color: "#F5F5F7",
    theme_color: "#F5F5F7",
    orientation: "portrait",
    icons: [
      {
        src: "/images/irawa-logo.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/images/irawa-logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
      {
        src: "/images/irawa-logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  };
}
