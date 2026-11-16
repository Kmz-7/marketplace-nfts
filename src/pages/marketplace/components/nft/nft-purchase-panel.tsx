import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { HeartIcon } from '@/components/ui/icons'
import { QuantityButton } from '@/components/ui/quantity-button'
import { Separator } from '@/components/ui/separator'

type NftPurchasePanelProps = {
  quantity: number
  isFavorite: boolean
  shareUrl: string
  onQuantityChange: (quantity: number) => void
  onFavoriteChange: () => void
}

export function NftPurchasePanel({
  quantity,
  isFavorite,
  shareUrl,
  onQuantityChange,
  onFavoriteChange,
}: NftPurchasePanelProps) {
  return (
    <Card className="gap-0 rounded-2xl bg-card p-5 ring-0 md:bg-transparent md:p-0">
      <CardContent className="p-0">
        <h1 className="text-lg font-bold md:text-2xl">Emerald Ape #042</h1>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xl font-bold text-primary">1.19 ETH</p>
          <div
            className="flex flex-wrap items-center gap-2"
            aria-label="Avaliação de 4 de 5 estrelas, 19 avaliações de colecionadores"
          >
            <span className="flex items-center gap-0.5" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  className={`size-4 ${star < 4 ? 'fill-primary text-primary' : 'fill-[#CFB28C] text-[#CFB28C]'}`}
                />
              ))}
            </span>
            <span className="text-xs text-foreground">19 avaliações de colecionadores</span>
          </div>
        </div>

        <Separator className="my-2 bg-border" />

        <section aria-labelledby="about-nft-title">
          <h2 id="about-nft-title" className="text-[15px] font-semibold text-foreground">
            Sobre este NFT:
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na
            Ethereum, com arte desbloqueável e acesso para colecionadores.
          </p>
        </section>

        <h2 className="mt-2 text-md font-semibold">Edição:</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {['1/1', '1/10', '1/50', 'ABERTA'].map((edition, index) => (
            <Badge
              key={edition}
              variant="outline"
              className={`h-9 w-fit rounded-[50%] px-2.5 text-[13px] font-medium ${index === 2 ? 'border-primary text-primary' : 'border-surface-dark-border text-muted-foreground'}`}
            >
              {edition}
            </Badge>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <QuantityButton
              action="decrease"
              scale="large"
              label="Diminuir quantidade"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            />
            <span className="min-w-4 text-center text-xl">{quantity}</span>
            <QuantityButton
              action="increase"
              scale="large"
              label="Aumentar quantidade"
              onClick={() => onQuantityChange(quantity + 1)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button render={<a href="/payment" />} className="h-12 w-[124px] rounded-lg px-4">
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
          <p>ID: #0042</p>
          <p>Coleção: Kurio Apes</p>
          <p>Atributos: Óculos, Esmeralda, Raro</p>
          <div className="flex flex-wrap items-center gap-0">
            <span className="text-sm font-semibold text-foreground">Compartilhar este NFT:</span>
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
              <img src="/assets/social/share-linkedin.svg" alt="" className="size-full" />
            </Button>
            <Button
              render={<a href="mailto:?subject=Emerald%20Ape%20%23042&body=Confira%20este%20NFT" />}
              variant="ghost"
              size="icon-sm"
              aria-label="Compartilhar por e-mail"
              className="size-7 p-1 hover:bg-transparent"
            >
              <img src="/assets/social/share-email.svg" alt="" className="size-full" />
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
              <img src="/assets/social/share-twitter.svg" alt="" className="size-full" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
