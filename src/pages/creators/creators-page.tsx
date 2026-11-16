import { Link, useSearch } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MarketplaceBreadcrumb } from '@/pages/marketplace/components/marketplace-breadcrumb'
import { creatorFeatures } from './creator-data'

export function CreatorsPage() {
  const { feature: featureId } = useSearch({ from: '/creators' })
  const selected = creatorFeatures.find((feature) => feature.id === featureId) ?? creatorFeatures[0]

  return (
    <main className="space-y-10 py-8 md:py-10">
      <MarketplaceBreadcrumb currentPage="Criadores" className="text-xs" />
      <article className="grid gap-6 md:grid-cols-2 md:gap-10">
        {/* No Figma, imagem e texto dividiam a mesma superfície; a arte recebe moldura bg-card com p-4 e o conteúdo fica sem fundo, alinhado ao topo. */}
        <Card className="rounded-xl border-0 bg-card p-4 shadow-none ring-0">
          <img src={selected.image} alt={selected.imageAlt} className="image-standard aspect-square w-full rounded-lg" />
        </Card>
        <div className="flex h-full flex-col justify-between gap-8 py-2 md:py-4">
          <div className="space-y-4">
            <h1 className="text-lg font-semibold text-foreground">{selected.title}</h1>
            <p className="text-md leading-6 text-muted-foreground">{selected.description}</p>
          </div>
          <p className="text-md text-foreground">
            Autor: <span className="text-muted-foreground">{selected.author}</span>
          </p>
        </div>
      </article>
      <section aria-labelledby="creator-suggestions-title" className="mt-20">
        <div className="border-b border-border pb-3">
          <h2 id="creator-suggestions-title" className="text-lg font-semibold text-primary">Sugestões de criadores</h2>
        </div>
        {/* As duas sugestões cabem na faixa sem avanço automático; a rolagem horizontal permanece disponível em telas estreitas. */}
        <div className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth [scrollbar-none] [&::-webkit-scrollbar]:hidden">
          {creatorFeatures.map((feature) => (
            <Card key={feature.id} className="w-[min(85vw,25rem)] shrink-0 snap-start gap-0 overflow-hidden rounded-xl border-border bg-card p-0 sm:w-[calc((100%-1.25rem)/2)]">
              <Button
                render={<Link to="/creators" search={{ feature: feature.id }} />}
                variant="ghost"
                className="h-full w-full flex-col items-stretch gap-0 whitespace-normal rounded-none p-0 text-left hover:bg-transparent"
              >
                <img src={feature.image} alt={feature.imageAlt} className="image-banner aspect-[4/3] w-full" />
                <CardContent className="flex flex-col items-start gap-3 p-4">
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-md text-muted-foreground">{feature.description}</p>
                  <p className="text-xs text-foreground">Autor: <span className="text-muted-foreground">{feature.author}</span></p>
                </CardContent>
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
