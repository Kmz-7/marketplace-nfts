import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HeartIcon } from '@/components/ui/icons'
import { QuantityButton } from '@/components/ui/quantity-button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import type { MarketplaceNft } from '@/components/providers/marketplace-state-provider'

type NftPurchasePanelProps = {
  quantity: number
  nft: MarketplaceNft
  selectedEdition: string
  isEditionLoading: boolean
  isFavorite: boolean
  shareUrl: string
  onQuantityChange: (quantity: number) => void
  onEditionChange: (edition: string) => void
  onFavoriteChange: () => void
  onBuy: () => void
}

export function NftPurchasePanel({
  quantity,
  nft,
  selectedEdition,
  isEditionLoading,
  isFavorite,
  shareUrl,
  onQuantityChange,
  onEditionChange,
  onFavoriteChange,
  onBuy,
}: NftPurchasePanelProps) {
  return (
    <Card className="gap-0 rounded-2xl bg-card p-5 ring-0 md:bg-transparent md:p-0">
      <CardContent className="p-0">
        <h1 className="text-lg font-bold">{nft.name}</h1>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          {isEditionLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <p className="text-lg font-bold text-primary">{nft.price} ETH</p>
          )}
          <div
            className="flex flex-wrap items-center gap-2"
            aria-label="Avaliação de 4 de 5 estrelas, 19 avaliações de colecionadores"
          >
            <span className="flex items-center gap-0.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className={`size-4 ${star < 4 ? 'fill-primary text-primary' : 'fill-muted-foreground text-muted-foreground'}`}
                />
              ))}
            </span>
            <span className="text-xs text-foreground">19 avaliações de colecionadores</span>
          </div>
        </div>

        <Separator className="my-2 bg-border" />

        {/* No Figma, o espaçamento entre título e descrição variava; a pilha padroniza ambos em 12 px. */}
        <section aria-labelledby="about-nft-title" className="space-y-3">
          <h2 id="about-nft-title" className="text-lg font-semibold text-foreground">
            Sobre este NFT:
          </h2>
          <p className="text-md leading-6 text-muted-foreground">
            Um colecionável digital finalizado à mão por {nft.creator}, verificado na Ethereum,
            com arte desbloqueável e acesso para colecionadores.
          </p>
        </section>

        {/* No Figma, as edições tinham aparência estática; controles selecionáveis e skeleton curto deixam a troca perceptível. */}
        <h2 className="mt-2 text-xs font-semibold">Edição:</h2>
        {/* O Figma mostrava raios inconsistentes nos seletores de edição; rounded-lg mantém laterais retas e o mesmo raio em todas as opções. */}
        <div className="mt-3 flex flex-wrap gap-2">
          {['1/1', '1/10', '1/50', 'ABERTA'].map((edition) => (
            <Button
              key={edition}
              type="button"
              variant="outline"
              aria-pressed={selectedEdition === edition}
              disabled={isEditionLoading}
              onClick={() => onEditionChange(edition)}
              className={`h-8 rounded-lg px-2.5 text-xs font-medium ${selectedEdition === edition ? 'border-primary text-primary' : 'border-surface-dark-border text-muted-foreground'}`}
            >
              {edition}
            </Button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <QuantityButton
              action="decrease"
              scale="large"
              label="Diminuir quantidade"
              disabled={quantity <= 1}
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            />
            <span className="min-w-4 text-center text-md">{quantity}</span>
            <QuantityButton
              action="increase"
              scale="large"
              label="Aumentar quantidade"
              onClick={() => onQuantityChange(quantity + 1)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" onClick={onBuy} className="h-12 w-[124px] rounded-lg px-4">
              Comprar
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-pressed={isFavorite}
              onClick={onFavoriteChange}
              className="h-12 gap-2 border-primary bg-transparent px-4 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <HeartIcon variant={isFavorite ? 'Bold' : 'Linear'} className="size-4" />
              {isFavorite ? 'Favoritado' : 'Favoritar'}
            </Button>
          </div>
        </div>

        <div className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
          <p>ID: {nft.tokenId}</p>
          <p>Coleção: {nft.collection ?? 'Kurio Editions'}</p>
          <p>Atributos: Óculos, Esmeralda, Raro</p>
          {/* No exemplo do Figma, os ícones de compartilhamento ficavam encostados e variavam de tamanho; gap-1 e size-4 uniformizam a fileira. */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs font-semibold text-foreground">Compartilhar este NFT:</span>
            <Button
              render={
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                />
              }
              variant="ghost"
              size="icon-sm"
              aria-label="Compartilhar no LinkedIn"
              className="size-7 p-1 hover:bg-transparent"
            >
              <img src="/assets/social/share-linkedin.svg" alt="" className="size-4" />
            </Button>
            <Button
              render={<a href="mailto:?subject=Emerald%20Ape%20%23042&body=Confira%20este%20NFT" />}
              variant="ghost"
              size="icon-sm"
              aria-label="Compartilhar por e-mail"
              className="size-7 p-1 hover:bg-transparent"
            >
              <img src="/assets/social/share-email.svg" alt="" className="size-4" />
            </Button>
            <Button
              render={
                <a
                  href={`https://twitter.com/intent/tweet?text=Confira%20Emerald%20Ape%20%23042&url=${shareUrl}`}
                  target="_blank"
                  rel="noreferrer"
                />
              }
              variant="ghost"
              size="icon-sm"
              aria-label="Compartilhar no Twitter"
              className="size-7 p-1 hover:bg-transparent"
            >
              <img src="/assets/social/share-twitter.svg" alt="" className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
