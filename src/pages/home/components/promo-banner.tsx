import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type PromoBannerProps = {
  image: string
  imageAlt: string
  eyebrow: string
  eyebrowClassName?: string
  title: ReactNode
  featureId: string
}

export function PromoBanner({
  image,
  imageAlt,
  eyebrow,
  eyebrowClassName = '',
  title,
  featureId,
}: PromoBannerProps) {
  return (
    <Card className="grid h-[250px] grid-cols-2 gap-0 overflow-hidden rounded-2xl border-0 bg-card p-0 ring-0">
      <img src={image} alt={imageAlt} loading="lazy" decoding="async" className="image-banner h-full min-h-0 w-full rounded-2xl" />
      {/* No exemplo do Figma, o texto começava colado à imagem e a ação ao texto descritivo; recuperar padding e margem padrão separa os blocos sem mudar a composição. */}
      {/* No Figma, os títulos, descrições e ações dos banners terminavam em alturas diferentes; linhas reservadas alinham título, corpo e rodapé sem reduzir a fonte. */}
      <CardContent className="grid h-full grid-rows-[48px_1fr_40px] items-center justify-items-end gap-3 p-4 text-right sm:p-5">
        <h2 className="line-clamp-2 w-full text-lg leading-6 font-semibold text-foreground">{title}</h2>
        <p className={`line-clamp-3 w-full self-start text-md leading-5 text-muted-foreground ${eyebrowClassName}`}>
          {eyebrow}
        </p>
        <Button render={<Link to="/creators" search={{ feature: featureId }} />} size="sm" className="h-10 gap-2 rounded-lg text-xs">
          Explorar <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
