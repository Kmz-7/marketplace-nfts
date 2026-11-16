import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { getNft } from '@/api/nft.api'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { StatusAlert, StatusAlertAction } from '@/components/status-alert'
import { images } from '@/pages/marketplace/marketplace-data'
import { items } from '@/pages/marketplace/marketplace-data'
import { NftGallery } from '@/pages/marketplace/components/nft/nft-gallery'
import { NftInformationTabs } from '@/pages/marketplace/components/nft/nft-information-tabs'
import { NftPurchasePanel } from '@/pages/marketplace/components/nft/nft-purchase-panel'
import { MobileNftActionBar } from '@/pages/marketplace/components/nft/nft-purchase-panel'
import { DeferredRelatedProducts } from '@/pages/marketplace/components/deferred-related-products'
import { MarketplaceBreadcrumb } from '@/pages/marketplace/components/marketplace-breadcrumb'
import { MobileMarketplaceHeader } from '@/pages/marketplace/components/mobile-marketplace-header'
import { useMarketplaceState, type MarketplaceNft } from '@/components/providers/marketplace-state-provider'
import { useSession } from '@/hooks/use-auth'
import { useAuthDialog } from '@/components/providers/auth-dialog-provider'
import { savePendingMarketplaceAction } from '@/lib/pending-marketplace-action'
import { showMarketplaceActionToast } from '@/components/marketplace-action-toast'
import { Heart, X } from 'lucide-react'
import { toast } from 'sonner'

export function NftPage() {
  const search = useSearch({ from: '/nft' })
  const navigate = useNavigate()
  const session = useSession()
  const marketplace = useMarketplaceState()
  const { openAuthDialog } = useAuthDialog()
  const productId = search.item ?? items[0].id
  const fallbackProduct = items.find((item) => item.id === productId) ?? items[0]
  // O desafio pede um estado explícito para identificadores ausentes; o detalhe usa o registro REST quando existe.
  const detailQuery = useQuery({
    queryKey: ['nft', productId],
    queryFn: ({ signal }) => getNft(productId, signal),
  })
  const product = detailQuery.data
    ? {
        id: detailQuery.data.id,
        name: detailQuery.data.name,
        creator: detailQuery.data.creator,
        edition: detailQuery.data.edition,
        collection: detailQuery.data.collection,
        price: detailQuery.data.priceEth,
        image: detailQuery.data.imageUrl,
      }
    : fallbackProduct
  const [editionState, setEditionState] = useState({ itemId: product.id, edition: product.edition })
  const selectedEdition = editionState.itemId === product.id ? editionState.edition : product.edition
  const selectedEditionPrice = detailQuery.data?.editionPricesEth?.[selectedEdition] ?? product.price
  const nft: MarketplaceNft = {
    ...product,
    tokenId: `#${product.id.match(/(\d+)$/)?.[1]?.padStart(4, '0') ?? product.id}`,
    rarityBadge: detailQuery.data?.rarityBadge,
    price: selectedEditionPrice,
  }
  const gallery = Array.from({ length: 4 }, () => product.image || images.emerald)
  const [imageState, setImageState] = useState({ itemId: product.id, index: 0 })
  const selectedImageIndex = imageState.itemId === product.id ? imageState.index : 0
  const selectedImage = gallery[selectedImageIndex]
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isEditionLoading, setIsEditionLoading] = useState(false)
  const isFavorite = marketplace.isFavorite(nft.id)
  const shareUrl = encodeURIComponent(window.location.href)
  const goBack = () => void navigate({ to: '/' })

  useEffect(() => {
    if (!isImageLoading) return
    const timeout = window.setTimeout(() => setIsImageLoading(false), 400)
    return () => window.clearTimeout(timeout)
  }, [selectedImage, isImageLoading])

  const selectImage = (index: number) => {
    setIsImageLoading(true)
    setImageState({ itemId: product.id, index })
  }

  useEffect(() => {
    if (!isEditionLoading) return
    const timeout = window.setTimeout(() => setIsEditionLoading(false), 400)
    return () => window.clearTimeout(timeout)
  }, [isEditionLoading, selectedEdition])

  if (detailQuery.isError) {
    return (
      <main className="py-8 md:py-12">
        <MobileMarketplaceHeader onBack={goBack} />
        <MarketplaceBreadcrumb className="mb-6 hidden text-xs md:flex" />
        <StatusAlert
          className="mt-6 md:mt-0"
          title="NFT não encontrado"
          headingLevel="h1"
          description="Este item não está disponível no catálogo. Volte à página inicial para escolher outro NFT."
          action={<StatusAlertAction render={<Link to="/" />}>Voltar ao catálogo</StatusAlertAction>}
        />
      </main>
    )
  }

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

  async function handleAddToCart() {
    // O ícone de carrinho só adiciona o item; a navegação para o carrinho fica com "Comprar NFT" ou com a ação do aviso.
    try {
      const added = await marketplace.addToCart({ ...nft, edition: selectedEdition }, quantity)
      showMarketplaceActionToast(added ? 'cart-added' : 'cart-existing', () => {
        void navigate({ to: '/cart' })
      })
    } catch {
      toast.error('Não foi possível adicionar este NFT ao carrinho. Tente novamente.')
    }
  }

  async function handleBuy() {
    // O Figma ligava Comprar diretamente ao pagamento; o carrinho preserva a edição e quantidade escolhidas antes da autenticação.
    try {
      await marketplace.addToCart({ ...nft, edition: selectedEdition }, quantity)
      void navigate({ to: '/cart' })
    } catch {
      toast.error('Não foi possível adicionar este NFT ao carrinho. Tente novamente.')
    }
  }

  return (
    <main className="relative isolate -mx-4 bg-background px-7 pt-6 pb-44 md:mx-0 md:px-0 md:py-12">
      {/* No Figma mobile, o topo (ações e arte) fica sobre um fundo em gradiente de superfície de ponta a ponta. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(100vw+1.5rem)] surface-gradient md:hidden"
      />
      {/* Mobile/Detalhes do NFT usa seta e ação de favorito no topo; o breadcrumb pertence à composição desktop. */}
      <MobileMarketplaceHeader
        onBack={goBack}
        action={
          <Button
            type="button"
            variant="surface"
            size="icon-lg"
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Favoritar NFT'}
            aria-pressed={isFavorite}
            className="text-primary"
            onClick={() => void handleFavorite()}
          >
            <Heart className={`size-4 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
          </Button>
        }
      />
      <MarketplaceBreadcrumb className="mb-5 hidden text-xs md:flex" />
      <section
        className="mt-3 grid items-start gap-6 md:mt-0 md:grid-cols-2 md:gap-12"
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
            setEditionState({ itemId: product.id, edition })
            setIsEditionLoading(true)
          }}
          onFavoriteChange={handleFavorite}
          onBuy={handleBuy}
        />
      </section>
      <MobileNftActionBar
        quantity={quantity}
        price={nft.price}
        onQuantityChange={setQuantity}
        onBuy={handleBuy}
        onAddToCart={() => void handleAddToCart()}
      />
      {/* No Figma, a ampliação ficava dentro de um cartão; a imagem ocupa o modo de visualização sobre o overlay da tela inteira. */}
      {/* O diálogo fechado ainda baixava a imagem original de 1000 px; montá-lo sob demanda evita duplicar o download da arte responsiva. */}
      {isImageFullscreen && (
        <Dialog open onOpenChange={setIsImageFullscreen}>
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
              decoding="async"
            />
          </DialogContent>
        </Dialog>
      )}
      <NftInformationTabs
        nftId={product.id}
        nftName={nft.name}
        creator={nft.creator}
        edition={selectedEdition}
      />
      <DeferredRelatedProducts title="Mais destaques" />
    </main>
  )
}
