import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { getNft } from '@/api/nft.api'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { images } from '@/pages/marketplace/marketplace-data'
import { items } from '@/pages/marketplace/marketplace-data'
import { NftGallery } from '@/pages/marketplace/components/nft/nft-gallery'
import { NftInformationTabs } from '@/pages/marketplace/components/nft/nft-information-tabs'
import { NftPurchasePanel } from '@/pages/marketplace/components/nft/nft-purchase-panel'
import { RelatedProducts } from '@/pages/marketplace/components/related-products'
import { MarketplaceBreadcrumb } from '@/pages/marketplace/components/marketplace-breadcrumb'
import { useMarketplaceState, type MarketplaceNft } from '@/components/providers/marketplace-state-provider'
import { useSession } from '@/hooks/use-auth'
import { useAuthDialog } from '@/components/providers/auth-dialog-provider'
import { savePendingMarketplaceAction } from '@/lib/pending-marketplace-action'
import { showMarketplaceActionToast } from '@/components/marketplace-action-toast'
import { X } from 'lucide-react'

export function NftPage() {
  const search = useSearch({ from: '/nft' })
  const navigate = useNavigate()
  const session = useSession()
  const marketplace = useMarketplaceState()
  const { openAuthDialog } = useAuthDialog()
  const product = items.find((item) => item.id === search.item) ?? items[0]
  const [selectedEdition, setSelectedEdition] = useState(product.edition)
  const detailQuery = useQuery({
    queryKey: ['nft', product.id],
    queryFn: ({ signal }) => getNft(product.id, signal),
  })
  const selectedEditionPrice = detailQuery.data?.editionPricesEth?.[selectedEdition] ?? product.price
  const nft: MarketplaceNft = {
    ...product,
    tokenId: `#${product.id.match(/(\d+)$/)?.[1]?.padStart(4, '0') ?? product.id}`,
    rarityBadge: product.id === 'emerald-ape-042' ? 'RARO' : undefined,
    price: selectedEditionPrice,
  }
  const gallery = Array.from({ length: 4 }, () => product.image || images.emerald)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const selectedImage = gallery[selectedImageIndex]
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isEditionLoading, setIsEditionLoading] = useState(false)
  const isFavorite = marketplace.isFavorite(nft.id)
  const shareUrl = encodeURIComponent(window.location.href)

  useEffect(() => {
    if (!isImageLoading) return
    const timeout = window.setTimeout(() => setIsImageLoading(false), 400)
    return () => window.clearTimeout(timeout)
  }, [selectedImage, isImageLoading])

  const selectImage = (index: number) => {
    setIsImageLoading(true)
    setSelectedImageIndex(index)
  }

  useEffect(() => {
    if (!isEditionLoading) return
    const timeout = window.setTimeout(() => setIsEditionLoading(false), 400)
    return () => window.clearTimeout(timeout)
  }, [isEditionLoading, selectedEdition])

  useEffect(() => {
    setSelectedImageIndex(0)
    setSelectedEdition(product.edition)
  }, [product.id, product.edition])

  async function handleFavorite() {
    let currentSession = session.data
    if (!currentSession && session.isPending) currentSession = (await session.refetch()).data
    if (!currentSession?.authenticated) {
      savePendingMarketplaceAction({ action: 'favorite', item: nft })
      openAuthDialog()
      return
    }
    if (isFavorite) {
      marketplace.removeFavorite(nft.id)
      showMarketplaceActionToast('favorite-removed', () => void navigate({ to: '/favorites' }))
      return
    }
    const added = marketplace.addFavorite(nft)
    showMarketplaceActionToast(added ? 'favorite-added' : 'favorite-existing', () => {
      void navigate({ to: '/favorites' })
    })
  }

  function handleBuy() {
    // O Figma ligava Comprar diretamente ao pagamento; o carrinho preserva a edição e quantidade escolhidas antes da autenticação.
    marketplace.addToCart({ ...nft, edition: selectedEdition }, quantity)
    void navigate({ to: '/cart' })
  }

  return (
    <main className="py-7 md:py-12">
      <MarketplaceBreadcrumb className="mb-5 text-xs" />
      <section
        className="grid items-start gap-6 md:grid-cols-2 md:gap-12"
        aria-label={`Detalhes do ${nft.name}`}
      >
        <NftGallery
          gallery={gallery}
          selectedImage={selectedImage}
          selectedImageIndex={selectedImageIndex}
          nftName={nft.name}
          isImageLoading={isImageLoading}
          onSelectImage={selectImage}
          onOpenFullscreen={() => setIsImageFullscreen(true)}
        />
        <NftPurchasePanel
          quantity={quantity}
          nft={nft}
          selectedEdition={selectedEdition}
          isEditionLoading={isEditionLoading}
          isFavorite={isFavorite}
          shareUrl={shareUrl}
          onQuantityChange={setQuantity}
          onEditionChange={(edition) => {
            setSelectedEdition(edition)
            setIsEditionLoading(true)
          }}
          onFavoriteChange={handleFavorite}
          onBuy={handleBuy}
        />
      </section>
      {/* No Figma, a ampliação ficava dentro de um cartão; a imagem ocupa o modo de visualização sobre o overlay da tela inteira. */}
      <Dialog open={isImageFullscreen} onOpenChange={setIsImageFullscreen}>
        <DialogContent
          showCloseButton={false}
          className="flex h-dvh w-screen max-w-none items-center justify-center rounded-none border-0 bg-transparent p-0 shadow-none ring-0"
          overlayClassName="bg-black/90 backdrop-blur-sm"
        >
          <DialogTitle className="sr-only">Imagem ampliada de {nft.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Visualização ampliada da imagem selecionada sem cartão de fundo.
          </DialogDescription>
          <DialogClose
            render={<Button variant="ghost" size="icon" aria-label="Fechar visualização" className="fixed top-4 right-4 z-10 rounded-lg text-foreground hover:bg-card/30" />}
          >
            <X className="size-4" />
          </DialogClose>
          <img
            src={selectedImage}
            alt={`${nft.name} ampliado`}
            className="max-h-[92dvh] max-w-[92vw] object-contain"
          />
        </DialogContent>
      </Dialog>
      <NftInformationTabs nftName={nft.name} creator={nft.creator} edition={selectedEdition} />
      <RelatedProducts title="Mais destaques" />
    </main>
  )
}
