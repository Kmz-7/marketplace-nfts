import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { images } from '@/pages/marketplace/marketplace-data'
import { NftGallery } from '@/pages/marketplace/components/nft/nft-gallery'
import { NftInformationTabs } from '@/pages/marketplace/components/nft/nft-information-tabs'
import { NftPurchasePanel } from '@/pages/marketplace/components/nft/nft-purchase-panel'
import { RelatedProducts } from '@/pages/marketplace/components/related-products'
import { MarketplaceBreadcrumb } from '@/pages/marketplace/components/marketplace-breadcrumb'

export function NftPage() {
  const gallery = Array.from({ length: 4 }, () => images.emerald)
  const [selectedImage, setSelectedImage] = useState(gallery[0])
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const shareUrl = encodeURIComponent(window.location.href)

  useEffect(() => {
    if (!isImageLoading) return
    const timeout = window.setTimeout(() => setIsImageLoading(false), 350)
    return () => window.clearTimeout(timeout)
  }, [selectedImage, isImageLoading])

  const selectImage = (image: string) => {
    if (image === selectedImage) return
    setIsImageLoading(true)
    setSelectedImage(image)
  }

  return (
    <main className="py-7 md:py-12">
      <MarketplaceBreadcrumb className="mb-5 text-xs" />
      <section
        className="grid items-start gap-6 md:grid-cols-2 md:gap-12"
        aria-label="Detalhes do Emerald Ape #042"
      >
        <NftGallery
          gallery={gallery}
          selectedImage={selectedImage}
          isImageLoading={isImageLoading}
          onSelectImage={selectImage}
          onOpenFullscreen={() => setIsImageFullscreen(true)}
        />
        <NftPurchasePanel
          quantity={quantity}
          isFavorite={isFavorite}
          shareUrl={shareUrl}
          onQuantityChange={setQuantity}
          onFavoriteChange={() => setIsFavorite((value) => !value)}
        />
      </section>
      <Dialog open={isImageFullscreen} onOpenChange={setIsImageFullscreen}>
        <DialogContent
          className="flex h-[calc(100dvh-2rem)] max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-none items-center justify-center border-0 bg-background/95 p-3 sm:p-6"
          overlayClassName="bg-black/85"
        >
          <DialogTitle className="sr-only">Imagem ampliada de Emerald Ape #042</DialogTitle>
          <DialogDescription className="sr-only">
            Visualização em tela cheia da imagem selecionada.
          </DialogDescription>
          <img
            src={selectedImage}
            alt="Emerald Ape #042 em tela cheia"
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
      <NftInformationTabs />
      <RelatedProducts title="Mais destaques" />
    </main>
  )
}
