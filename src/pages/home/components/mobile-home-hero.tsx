import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { marketplaceImageSrcSet } from '@/lib/responsive-image'

export function MobileHomeHero() {
  return (
    <Card className="relative mt-0 gap-4 overflow-hidden rounded-3xl bg-primary/15 p-4 ring-0">
      {/* Círculos decorativos do banner mobile, exportados do Figma (Mask Group). */}
      {/* O SVG esticado deformava os círculos do Figma em ovais e o recorte do Figma os cortava em linha reta; os círculos ficam inteiros e centralizados.
          Abaixo de 425 px o banner fica alto (arte em cima, texto embaixo), então o desenho é ampliado pela altura para cobrir o painel todo. O tom de fundo virou bg-primary/15. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 max-xs:inset-y-0 max-xs:left-1/2 max-xs:right-auto max-xs:top-0 max-xs:-translate-x-1/2 max-xs:translate-y-0"
      >
        <img src="/assets/marketplace/mobile-hero-circles.svg" alt="" className="h-auto w-full max-xs:h-full max-xs:w-auto max-xs:max-w-none" />
      </span>
      {/* Abaixo de 425 px, texto e arte lado a lado ficavam espremidos; a arte vem primeiro e o texto ocupa a largura toda. */}
      <CardContent className="relative flex items-center gap-2 p-0 max-xs:flex-col max-xs:items-stretch max-xs:gap-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-xs font-medium">Bem-vindo à Kurio</p>
          {/* A largura limitada reproduz a quebra do Figma: "SEJA DONO DA / CULTURA DIGITAL". */}
          <h1 className="max-w-48 text-lg leading-7 font-bold uppercase">Seja dono da cultura digital</h1>
          <p className="text-xs leading-5 text-muted-foreground">
            Descubra NFTs selecionados de criadores do mundo todo.
          </p>
          <Button
            render={<a href="#catalogo-mobile" />}
            variant="link"
            className="h-auto gap-2 p-0 text-xs font-bold"
          >
            EXPLORAR <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        {/* O Figma sobrepunha uma segunda arte (Sage Nomad) no canto da principal; ela cobria parte da arte e não tinha função, então foi removida. */}
        <div className="relative w-32 shrink-0 max-xs:order-first max-xs:w-full">
          <img
            src="/assets/marketplace/ape-sunglasses.webp"
            srcSet={marketplaceImageSrcSet('/assets/marketplace/ape-sunglasses.webp')}
            sizes="(max-width: 767px) 36vw, 450px"
            alt="NFT Emerald Ape"
            className="image-banner aspect-square w-full rounded-2xl max-xs:aspect-video max-xs:object-[50%_30%]"
            fetchPriority="high"
          />
        </div>
      </CardContent>
      <div className="relative flex justify-center gap-1.5">
        <span className="carousel-indicator carousel-indicator-compact bg-primary" />
        <span className="carousel-indicator carousel-indicator-compact bg-primary/50" />
        <span className="carousel-indicator carousel-indicator-compact bg-primary/50" />
      </div>
    </Card>
  )
}
