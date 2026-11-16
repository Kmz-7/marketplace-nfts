import { PromoBanner } from '@/pages/home/components/promo-banner'

export function HomeHighlights() {
  return (
    <section id="lancamentos" className="grid gap-4 md:grid-cols-2" aria-label="Destaques da Kurio">
      <PromoBanner
        image="/assets/marketplace/ape-sunglasses.png"
        imageAlt="Macaco com óculos de sol e jaqueta verde"
        eyebrow="Colecione edições escassas diretamente dos criadores antes da revelação pública"
        eyebrowClassName=""
        title={
          <>
            <span className="block">Lançamentos gênesis</span>
            <span className="block">de edição limitada</span>
          </>
        }
      />
      <PromoBanner
        image="/assets/marketplace/ape-cream-coat.png"
        imageAlt="Macaco com casaco claro"
        eyebrow="Explore novos artistas, coleções verificadas e obras digitais que definem a"
        eyebrowClassName="max-w-[250px]"
        title={
          <>
            <span className="block">Arte digital selecionada</span>
            <span className="block">e muito mais</span>
          </>
        }
      />
    </section>
  )
}
