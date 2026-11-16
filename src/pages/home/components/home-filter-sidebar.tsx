import { Card, CardContent } from '@/components/ui/card'
import { HomeCatalogFilters } from '@/pages/home/components/home-catalog-filters'
import { HomeNftCard } from '@/pages/home/components/home-nft-card'

type HomeFilterSidebarProps = {
  selectedCollection: string
  selectedNetwork: string
  onCollectionChange: (collection: string) => void
  onNetworkChange: (network: string) => void
  onPriceApply: (range: number[]) => void
}

export function HomeFilterSidebar({
  selectedCollection,
  selectedNetwork,
  onCollectionChange,
  onNetworkChange,
  onPriceApply,
}: HomeFilterSidebarProps) {
  return (
    <aside className="w-full" aria-label="Filtros do catálogo">
      <div className="space-y-8">
        {/* Padronizado os cards para que tenham o mesmo estilo e espaçamento */}
        <Card className="gap-0 border-0 bg-card p-5 shadow-none ring-0">
          <CardContent className="p-0">
            <HomeCatalogFilters
              selectedCollection={selectedCollection}
              selectedNetwork={selectedNetwork}
              onCollectionChange={onCollectionChange}
              onNetworkChange={onNetworkChange}
              onPriceApply={onPriceApply}
            />
          </CardContent>
        </Card>

        <Card
          aria-labelledby="featured-nft-title"
          className="gap-3 overflow-hidden rounded-lg border-0 bg-card p-0 py-4 shadow-none ring-0"
        >
          <CardContent className="space-y-3 p-0">
            {/* No Figma, o subtítulo e o título do destaque não compartilhavam alinhamento; adicionado padrão de tamanho, margens e alinhamento. */}
            <p className="text-center text-xs font-bold uppercase text-primary mb-1">
              NFT em destaque
            </p>
            <h2
              id="featured-nft-title"
              className="text-center text-lg font-bold uppercase text-foreground mb-0"
            >
              Oferta limitada
            </h2>
            {/* No Figma, a oferta destacada terminava na imagem; o card de catálogo acrescenta nome, preço e as mesmas ações por hover. */}
            <HomeNftCard
              id="sage-nomad-009"
              name="Sage Nomad #009"
              creator="Mika Tanaka"
              image="/assets/marketplace/ape-explorer.webp"
              price="1.69"
              previousPrice="1.99"
              edition="1/1"
            />
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
