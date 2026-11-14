import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

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

export function HomeFilterSidebar() {
  return (
    <aside className="w-full" aria-label="Filtros do catálogo">
      <div className="space-y-8">
        <Card className="gap-0 rounded-none border-0 bg-card p-5 shadow-none ring-0">
          <CardContent className="space-y-6 p-0">
            <FilterGroup title="Coleções">
              <ToggleGroup aria-label="Coleções" defaultValue={[collections[0].id]} className="w-full flex-col items-stretch gap-2 rounded-none">
                {collections.map((collection) => (
                  <ToggleGroupItem key={collection.id} value={collection.id} variant="default" className="h-auto w-full justify-between rounded-none border-b border-transparent px-0 py-1 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground aria-pressed:border-primary aria-pressed:bg-transparent aria-pressed:text-primary lg:text-sm">
                    {collection.label}<span className="text-[10px] text-muted-foreground lg:text-xs">({collection.count})</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FilterGroup>

            <FilterGroup title="Faixa de preço">
              <Slider aria-label="Faixa de preço em ETH" defaultValue={[0.02, 12.3]} min={0} max={20} step={0.01} />
              <p className="mt-3 text-xs text-muted-foreground">Preço: 0,02 – 12,30 ETH</p>
              <Button className="mt-3 h-8 px-3 text-xs">Aplicar</Button>
            </FilterGroup>

            <FilterGroup title="Rede">
              <ToggleGroup aria-label="Redes" multiple className="w-full flex-col items-stretch gap-2 rounded-none">
                {networks.map((network) => (
                  <ToggleGroupItem key={network.id} value={network.id} variant="default" className="h-auto w-full justify-between rounded-none border-b border-transparent px-0 py-1 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground aria-pressed:border-primary aria-pressed:bg-transparent aria-pressed:text-primary lg:text-sm">
                    {network.label}<span className="text-[10px] text-muted-foreground lg:text-xs">({network.count})</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FilterGroup>
          </CardContent>
        </Card>

        <Card aria-labelledby="featured-nft-title" className="gap-3 overflow-hidden rounded-none border-0 bg-card p-3 pb-3 shadow-none ring-0">
          <CardContent className="space-y-3 p-0">
            <p className="text-lg font-bold uppercase text-primary">NFT em destaque</p>
            <h2 id="featured-nft-title" className="text-center text-lg font-bold uppercase text-foreground">Oferta limitada</h2>
            <img src="/assets/marketplace/ape-explorer.png" alt="NFT de macaco explorador com chapéu" className="-mx-3 mb-[-12px] block w-[calc(100%+24px)] max-w-none h-[368px] rounded-xl object-cover" />
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4" aria-label={title}>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  )
}

