import { lazy, Suspense, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Heart, ShoppingCart, ZoomIn } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useSession } from '@/hooks/use-auth'
import {
  useMarketplaceState,
  type MarketplaceNft,
} from '@/components/providers/marketplace-state-provider'
import { savePendingMarketplaceAction } from '@/lib/pending-marketplace-action'
import { showMarketplaceActionToast } from '@/components/marketplace-action-toast'
import { useAuthDialog } from '@/components/providers/auth-dialog-provider'
import { marketplaceImageSrcSet } from '@/lib/responsive-image'

const NftImagePreviewDialog = lazy(() =>
  import('@/pages/home/components/nft-image-preview-dialog').then((module) => ({
    default: module.NftImagePreviewDialog,
  })),
)

interface HomeNftCardProps {
  id?: string
  tokenId?: string
  name: string
  creator: string
  image: string
  price: string
  edition?: string
  rarityBadge?: string
  previousPrice?: string
  imageOnly?: boolean
  removeFromFavorites?: boolean
  priority?: boolean
}

export function HomeNftCard({
  id,
  tokenId,
  name,
  creator,
  image,
  price,
  edition = '1/1',
  rarityBadge,
  previousPrice,
  imageOnly = false,
  removeFromFavorites = false,
  priority = false,
}: HomeNftCardProps) {
  const navigate = useNavigate()
  const session = useSession()
  const marketplace = useMarketplaceState()
  const { openAuthDialog } = useAuthDialog()
  const [previewOpen, setPreviewOpen] = useState(false)
  const nftId = id ?? name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const nft: MarketplaceNft = {
    id: nftId,
    tokenId: tokenId ?? `#${nftId.match(/(\d+)$/)?.[1]?.padStart(4, '0') ?? nftId}`,
    name,
    creator,
    image,
    price,
    edition,
    rarityBadge,
  }
  const isFavorite = marketplace.isFavorite(nftId)

  async function handleAction(action: 'cart' | 'favorite') {
    if (action === 'cart') {
      try {
        const added = await marketplace.addToCart(nft)
        showMarketplaceActionToast(added ? 'cart-added' : 'cart-existing', () => {
          void navigate({ to: '/cart' })
        })
      } catch {
        toast.error('Não foi possível atualizar o carrinho. Tente novamente.')
      }
      return
    }

    let currentSession = session.data
    if (!currentSession && session.isPending) currentSession = (await session.refetch()).data
    if (!currentSession?.authenticated) {
      savePendingMarketplaceAction({ action, item: nft })
      openAuthDialog()
      return
    }

    if (isFavorite && removeFromFavorites) {
      marketplace.removeFavorite(nftId)
      showMarketplaceActionToast('favorite-removed', () => void navigate({ to: '/favorites' }))
      return
    }
    const added = marketplace.addFavorite(nft)
    showMarketplaceActionToast(added ? 'favorite-added' : 'favorite-existing', () => {
      void navigate({ to: '/favorites' })
    })
  }

  return (
    <>
      <Card className="group relative min-w-0 gap-0 overflow-visible rounded-none bg-transparent p-0 text-foreground ring-0">
        <Button
          render={<Link to="/nft" search={{ item: nftId }} />}
          variant="ghost"
          aria-label={`Ver detalhes de ${name}`}
          className="absolute inset-0 z-10 h-full w-full rounded-none p-0 hover:bg-transparent focus-visible:ring-inset dark:hover:bg-transparent"
        />
        {/* O Figma mostrava apenas um coração fixo; a faixa de três ações segue a referência e usa entrada gradual pela base da arte. */}
        {/* Mobile: o Figma dava 4 px de moldura nas laterais e 16 px em cima/baixo; o respiro uniforme deixa o fundo visível como no desktop. */}
        <Card className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-card p-4 ring-0 max-md:rounded-2xl max-md:surface-gradient max-md:p-2.5">
          <CardContent className="relative flex h-full w-full items-center justify-center bg-transparent p-0">
            <img
              src={image}
              srcSet={marketplaceImageSrcSet(image)}
              sizes="(max-width: 767px) 46vw, (max-width: 1024px) 33vw, 300px"
              alt={name}
              className="image-standard aspect-square w-[calc(100%-8px)] rounded-[15px] max-md:w-full"
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              decoding="async"
            />
            {rarityBadge && (
              /* O Figma mobile colava o selo à borda esquerda do card; ele fica sobre a arte, alinhado ao coração (mesmo recuo e altura) no mobile. */
              <Badge className="absolute top-1.5 left-1.5 z-20 h-7 rounded-lg px-2.5 text-xs font-medium md:top-3 md:left-3 md:h-5 md:px-2 md:font-normal">
                {rarityBadge}
              </Badge>
            )}
          </CardContent>
          {!imageOnly && (
            <div className="absolute inset-x-0 bottom-5 z-20 hidden translate-y-2 items-center justify-center gap-2 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transform-none motion-reduce:transition-none md:flex">
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                aria-label={`Adicionar ${name} ao carrinho`}
                className="border border-border bg-background/90 text-foreground shadow-sm hover:border-primary hover:bg-card hover:text-primary"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  void handleAction('cart')
                }}
              >
                <ShoppingCart className="size-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                aria-label={`${isFavorite ? 'Já está nos favoritos' : 'Favoritar'} ${name}`}
                aria-pressed={isFavorite}
                className={`border border-border bg-background/90 shadow-sm hover:border-primary hover:bg-card hover:text-primary ${isFavorite ? 'text-primary' : 'text-foreground'}`}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  void handleAction('favorite')
                }}
              >
                <Heart
                  className={`size-4 ${isFavorite ? 'fill-current' : ''}`}
                  aria-hidden="true"
                />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                aria-label={`Visualizar arte de ${name}`}
                className="border border-border bg-background/90 text-foreground shadow-sm hover:border-primary hover:bg-card hover:text-primary"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  setPreviewOpen(true)
                }}
              >
                {/* A lupa com sinal de + comunica melhor a ampliação do que a lupa simples apresentada no Figma. */}
                <ZoomIn className="size-4" aria-hidden="true" />
              </Button>
            </div>
          )}
          {!imageOnly && (
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              aria-label={`${isFavorite ? 'Já está nos favoritos' : 'Favoritar'} ${name}`}
              aria-pressed={isFavorite}
              // O Figma posicionava o coração dentro, fora ou omitia em cada card; todos usam o canto superior direito da arte.
              className={`absolute top-4 right-4 z-20 hidden size-7 border border-border bg-background/90 p-0 shadow-sm hover:border-primary hover:bg-card hover:text-primary max-md:inline-flex ${isFavorite ? 'text-primary' : 'text-foreground'}`}
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                void handleAction('favorite')
              }}
            >
              <Heart className={`size-4 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
            </Button>
          )}
        </Card>
        {!imageOnly && (
          /* No Figma, os nomes dos NFTs apareciam em tamanhos diferentes dos títulos equivalentes; a escala usa lg. Adicionado espaçamento para que a fonte tenha margem consistente com a imagem */
          <CardContent className="mt-2 flex flex-col items-start gap-1 px-5 max-md:gap-0.5 max-md:px-2">
            {/* No Figma mobile, nome 15 regular e preço 16 bold; o nome usa sm para caber na coluna de 390 px sem truncar. */}
            <CardTitle className="max-w-full truncate text-lg font-medium max-md:text-sm max-md:font-normal">
              <h3>{name}</h3>
            </CardTitle>
            <div className="flex items-center gap-2">
              <p className="whitespace-nowrap text-md font-semibold text-primary max-md:font-bold max-md:text-link">{price} ETH</p>
              {previousPrice && (
                // A oferta mostrada no Figma não distinguia o valor anterior; o risco em muted-foreground comunica o desconto sem competir com o preço atual.
                <p className="whitespace-nowrap text-md font-semibold text-muted-foreground line-through max-md:text-xs">
                  {previousPrice} ETH
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>
      {/* Prévia fechada ainda requisitava a arte de 1000 px; só montar o diálogo ao abrir mantém a versão responsiva no primeiro carregamento. */}
      {previewOpen && (
        <Suspense fallback={null}>
          <NftImagePreviewDialog name={name} image={image} onOpenChange={setPreviewOpen} />
        </Suspense>
      )}
    </>
  )
}
