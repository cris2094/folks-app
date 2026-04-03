import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  // TODO: Make dynamic per tenant (fetch tenant branding from DB/cookie)
  return {
    name: "Irawa",
    short_name: "Irawa",
    description: "Gestión Residencial Inteligente",
    start_url: "/home",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#D4A017",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
