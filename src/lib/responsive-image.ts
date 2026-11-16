export function marketplaceImageSrcSet(src: string) {
  if (!src.startsWith('/assets/marketplace/') || !src.endsWith('.webp')) return undefined

  const mobile = src.replace(/\.webp$/, '-512w.webp')
  return `${mobile} 512w, ${src} 1000w`
}
