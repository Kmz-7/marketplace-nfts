import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export function MobileHomeHero() {
  return (
    <Card className="relative mt-4 grid grid-cols-[1.2fr_1fr] gap-2 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#8e5b35] to-[#281910] p-4 ring-0">
      <CardContent className="p-0">
        <p className="text-xs">Bem-vindo à Kurio</p>
        <h1 className="mt-3 text-lg leading-7 font-bold uppercase">Seja dono da cultura digital</h1>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Descubra NFTs selecionados de criadores do mundo todo.
        </p>
        <Button
          render={<a href="#catalogo-mobile" />}
          variant="link"
          className="mt-1 h-auto gap-2 p-0 text-xs font-semibold"
        >
          EXPLORAR <ArrowRight className="size-4" />
        </Button>
      </CardContent>
      <img
        src="/assets/marketplace/ape-sunglasses.png"
        alt="NFT Emerald Ape"
        className="aspect-square w-full rounded-2xl object-cover"
      />
      <div className="col-span-2 flex justify-center gap-1">
        <span className="size-1.5 rounded-full bg-primary" />
        <span className="size-1.5 rounded-full bg-primary/50" />
        <span className="size-1.5 rounded-full bg-primary/50" />
      </div>
    </Card>
  )
}
