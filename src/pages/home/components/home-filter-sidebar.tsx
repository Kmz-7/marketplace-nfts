import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { HomeNftCard } from '@/pages/home/components/home-nft-card'

const collections = [
  { id: 'digital-art', label: 'Arte digital', count: 33 },
  { id: 'photography', label: 'Fotografia', count: 12 },
  { id: 'music', label: 'Música', count: 65 },
  { id: '3d-art', label: 'Arte 3D', count: 39 },
  { id: 'collectibles', label: 'Colecionáveis', count: 23 },
  { id: 'generative', label: 'Generativa', count: 17 },
  { id: 'games', label: 'Jogos', count: 19 },
  { id: 'memberships', label: 'Assinaturas', count: 13 },
  { id: 'utility', label: 'Utilidade', count: 18 },
]

const networks = [
  { id: 'ethereum', label: 'Ethereum', count: 119 },
  { id: 'polygon', label: 'Polygon', count: 78 },
  { id: 'solana', label: 'Solana', count: 86 },
]

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
  const [priceRange, setPriceRange] = useState([0.02, 12.3])

  return (
    <aside className="w-full" aria-label="Filtros do catálogo">
      <div className="space-y-8">
        {/* Padronizado os cards para que tenham o mesmo estilo e espaçamento */}
        <Card className="gap-0 border-0 bg-card p-5 shadow-none ring-0">
          <CardContent className="space-y-6 p-0">
            <FilterGroup title="Coleções">
              <ToggleGroup
                aria-label="Coleções"
                value={selectedCollection ? [selectedCollection] : []}
                onValueChange={(value) => onCollectionChange(value[0] ?? '')}
                className="w-full flex-col items-stretch gap-2 rounded-none"
              >
                {collections.map((collection) => (
                  <ToggleGroupItem
                    key={collection.id}
                    value={collection.id}
                    variant="default"
                    className="group h-auto w-full justify-between rounded-none border-0 px-0 py-1 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground aria-pressed:bg-transparent aria-pressed:text-primary lg:text-sm"
                  >
                    {collection.label}
                    <span className="text-xs text-muted-foreground group-aria-pressed:text-primary">
                      ({collection.count})
                    </span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FilterGroup>

            <FilterGroup title="Faixa de preço">
              <div>
                <Slider
                  aria-label="Faixa de preço em ETH"
                  value={priceRange}
                  onValueChange={(value) => {
                    if (Array.isArray(value)) setPriceRange([...value])
                  }}
                  min={0}
                  max={20}
                  step={0.01}
                />
                <p className="mt-3 text-xs text-muted-foreground">
                  Preço: {priceRange[0].toLocaleString('pt-BR', { minimumFractionDigits: 2 })} –{' '}
                  {priceRange[1].toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ETH
                </p>
                <Button
                  type="button"
                  onClick={() => onPriceApply(priceRange)}
                  className="mt-3 h-8 px-3 text-xs"
                >
                  Aplicar
                </Button>
              </div>
            </FilterGroup>

            <FilterGroup title="Rede">
              <ToggleGroup
                aria-label="Redes"
                value={selectedNetwork ? [selectedNetwork] : []}
                onValueChange={(value) => onNetworkChange(value[0] ?? '')}
                className="w-full flex-col items-stretch gap-2 rounded-none"
              >
                {networks.map((network) => (
                  <ToggleGroupItem
                    key={network.id}
                    value={network.id}
                    variant="default"
                    className="group h-auto w-full justify-between rounded-none border-0 px-0 py-1 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground aria-pressed:bg-transparent aria-pressed:text-primary lg:text-sm"
                  >
                    {network.label}
                    <span className="text-xs text-muted-foreground group-aria-pressed:text-primary">
                      ({network.count})
                    </span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FilterGroup>
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
              image="/assets/marketplace/ape-explorer.png"
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

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4" aria-label={title}>
      <h3 className="text-lg font-normal text-foreground">{title}</h3>
      {children}
    </section>
  )
}
