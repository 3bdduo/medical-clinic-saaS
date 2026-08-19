// Central manifest of every image the site uses, so the preloader can fetch
// them all up front on first load (per the "single load / SPA" requirement).
// Add new images here and they're automatically included in the preload pass.

export const IMAGE_MANIFEST = [
  "/images/hero-clinic-1.jpg",
  "/images/hero-clinic-2.jpg",
] as const;

export type ManifestImage = (typeof IMAGE_MANIFEST)[number];
