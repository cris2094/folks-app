import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  // TODO: Make dynamic per tenant (fetch tenant branding from DB/cookie)
  return {
    name: "Folks - Tu Conjunto",
    short_name: "Folks",
    description: "Gestion de tu conjunto residencial",
    start_url: "/home",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
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
