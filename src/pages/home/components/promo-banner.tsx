import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type PromoBannerProps = {
  image: string
  imageAlt: string
  eyebrow: string
  eyebrowClassName?: string
  title: ReactNode
}

export function PromoBanner({
  image,
  imageAlt,
  eyebrow,
  eyebrowClassName = '',
  title,
}: PromoBannerProps) {
  return (
    <Card className="grid h-[250px] grid-cols-2 gap-0 overflow-hidden rounded-2xl border-0 bg-card p-0 ring-0">
      <img src={image} alt={imageAlt} className="h-full min-h-0 w-full rounded-2xl object-cover" />
      <CardContent className="flex flex-col items-end justify-center p-4 !ps-0 text-right sm:p-5">
        <h2 className="w-full text-lg leading-5 font-semibold text-foreground">{title}</h2>
        <p className={`mt-2 text-sm leading-4 text-muted-foreground ${eyebrowClassName}`}>
          {eyebrow}
        </p>
        <Button size="sm" className="mt-0 h-10 gap-2 px-6 text-xs">
          Explorar <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
