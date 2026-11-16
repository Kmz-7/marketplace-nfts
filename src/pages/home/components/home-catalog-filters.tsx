import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const catalogCollections = [
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

const catalogNetworks = [
  { id: 'ethereum', label: 'Ethereum', count: 119 },
  { id: 'polygon', label: 'Polygon', count: 78 },
  { id: 'solana', label: 'Solana', count: 86 },
]

const defaultCatalogPriceRange = [0.02, 12.3]

export type HomeCatalogFiltersProps = {
  selectedCollection: string
  selectedNetwork: string
  priceRange?: number[] | null
  onCollectionChange: (collection: string) => void
  onNetworkChange: (network: string) => void
  onPriceApply: (range: number[]) => void
  /** `sidebar`: coluna do desktop. `sheet`: gaveta de filtros do mobile, com toque maior e texto sm. */
  layout?: 'sidebar' | 'sheet'
}

const optionClassName = {
  sidebar:
    'group h-auto w-full justify-between rounded-none border-0 px-0 py-1 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground aria-pressed:bg-transparent aria-pressed:text-primary lg:text-sm',
  sheet:
    'group h-10 w-full justify-between rounded-none border-0 px-0 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-foreground aria-pressed:bg-transparent aria-pressed:font-bold aria-pressed:text-link',
}

/** Filtros do catálogo (coleção, faixa de preço e rede), compartilhados entre a lateral do desktop e a gaveta do mobile. */
export function HomeCatalogFilters({
  selectedCollection,
  selectedNetwork,
  priceRange: appliedPriceRange,
  onCollectionChange,
  onNetworkChange,
  onPriceApply,
  layout = 'sidebar',
}: HomeCatalogFiltersProps) {
  const [priceRange, setPriceRange] = useState(appliedPriceRange ?? defaultCatalogPriceRange)
  const sheet = layout === 'sheet'

  return (
    <div className="space-y-6">
      <FilterGroup title="Coleções" sheet={sheet}>
        <ToggleGroup
          aria-label="Coleções"
          value={selectedCollection ? [selectedCollection] : []}
          onValueChange={(value) => onCollectionChange(value[0] ?? '')}
          className={sheet ? 'w-full flex-col items-stretch gap-0 rounded-none' : 'w-full flex-col items-stretch gap-2 rounded-none'}
        >
          {catalogCollections.map((collection) => (
            <ToggleGroupItem
              key={collection.id}
              value={collection.id}
              variant="default"
              className={optionClassName[layout]}
            >
              {collection.label}
              <span className="text-xs text-muted-foreground group-aria-pressed:text-primary">
                ({collection.count})
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FilterGroup>

      <FilterGroup title="Faixa de preço" sheet={sheet}>
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
          <div className={sheet ? 'mt-4 flex items-center justify-between gap-3' : undefined}>
            <p className={sheet ? 'text-sm text-muted-foreground' : 'mt-3 text-xs text-muted-foreground'}>
              Preço: {priceRange[0].toLocaleString('pt-BR', { minimumFractionDigits: 2 })} –{' '}
              {priceRange[1].toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ETH
            </p>
            <Button
              type="button"
              variant={sheet ? 'gradient' : 'default'}
              onClick={() => onPriceApply(priceRange)}
              className={sheet ? 'h-9 px-4 text-sm' : 'mt-3 h-8 px-3 text-xs'}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Rede" sheet={sheet}>
        <ToggleGroup
          aria-label="Redes"
          value={selectedNetwork ? [selectedNetwork] : []}
          onValueChange={(value) => onNetworkChange(value[0] ?? '')}
          className={sheet ? 'w-full flex-col items-stretch gap-0 rounded-none' : 'w-full flex-col items-stretch gap-2 rounded-none'}
        >
          {catalogNetworks.map((network) => (
            <ToggleGroupItem
              key={network.id}
              value={network.id}
              variant="default"
              className={optionClassName[layout]}
            >
              {network.label}
              <span className="text-xs text-muted-foreground group-aria-pressed:text-primary">
                ({network.count})
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FilterGroup>
    </div>
  )
}

function FilterGroup({ title, sheet, children }: { title: string; sheet: boolean; children: ReactNode }) {
  return (
    <section className={sheet ? 'space-y-3' : 'space-y-4'} aria-label={title}>
      {/* Os títulos dos filtros são subseções da Home; h2 mantém a hierarquia semântica sequencial. */}
      <h2 className={sheet ? 'text-md font-bold text-foreground' : 'text-lg font-normal text-foreground'}>{title}</h2>
      {children}
    </section>
  )
}
