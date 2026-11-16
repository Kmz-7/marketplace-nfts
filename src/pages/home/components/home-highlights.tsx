import { PromoBanner } from '@/pages/home/components/promo-banner'
import { creatorFeatures } from '@/pages/creators/creator-data'

export function HomeHighlights() {
  return (
    <section id="lancamentos" className="grid gap-4 md:grid-cols-2" aria-label="Destaques da Kurio">
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
    </section>
  )
}
