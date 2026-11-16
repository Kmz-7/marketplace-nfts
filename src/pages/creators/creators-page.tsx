import { useSearch } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { MarketplaceBreadcrumb } from '@/pages/marketplace/components/marketplace-breadcrumb'
import { PromoBanner } from '@/pages/home/components/promo-banner'
import { creatorFeatures } from './creator-data'

export function CreatorsPage() {
  const { feature: featureId } = useSearch({ from: '/creators' })
  const selected = creatorFeatures.find((feature) => feature.id === featureId) ?? creatorFeatures[0]

  return (
    <main className="space-y-10 py-8 md:py-10">
      <MarketplaceBreadcrumb currentPage="Criadores" includeMarket={false} className="text-xs" />
      <article className="grid gap-6 md:grid-cols-2 md:gap-10">
        {/* No Figma, imagem e texto dividiam a mesma superfície; a arte recebe moldura bg-card com p-4 e o conteúdo fica sem fundo, alinhado ao topo. */}
        <Card className="rounded-xl border-0 bg-card p-4 shadow-none ring-0">
          <img src={selected.image} alt={selected.imageAlt} className="image-standard aspect-square w-full rounded-lg" />
        </Card>
        <div className="flex h-full flex-col justify-between gap-8 py-2 md:py-4">
          <div className="space-y-4">
            <h1 className="text-lg font-semibold text-foreground">{selected.title}</h1>
            <p className="text-md leading-6 text-muted-foreground">{selected.description}</p>
            <p className="text-md leading-6 text-muted-foreground">{selected.biography}</p>
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
        {/* No Figma, as sugestões usavam cards diferentes dos lançamentos da Home; PromoBanner reaplica a composição e a ação compartilhadas. */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {creatorFeatures.map((feature) => (
            <PromoBanner
              key={feature.id}
              featureId={feature.id}
              image={feature.image}
              imageAlt={feature.imageAlt}
              eyebrow={feature.description}
              title={feature.title}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
