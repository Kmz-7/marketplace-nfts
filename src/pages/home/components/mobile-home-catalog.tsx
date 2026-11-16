import { StatusAlert, StatusAlertAction } from '@/components/status-alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HomeNftCard } from '@/pages/home/components/home-nft-card'
import type { HomeNft } from '@/pages/home/components/home-nft-mapper'

// Ordem dos seis primeiros cards no frame Mobile/Início; os demais itens do catálogo seguem depois.
const figmaMobileOrder = [
  'emerald-ape-042',
  'sage-nomad-009',
  'ivory-baron-088',
  'golden-beat-287',
  'violet-nomad-314',
  'neon-vessel-552',
]

const tabs = [
  { value: 'all', label: 'Todos' },
  { value: 'launches', label: 'Lançamentos' },
  { value: 'trending', label: 'Em alta' },
]

export function MobileHomeCatalog({
  nfts,
  total,
  loading,
  isError,
  curated,
  searching,
  activeTab,
  onTabChange,
  onClearFilters,
}: {
  nfts: HomeNft[]
  total: number
  loading: boolean
  isError: boolean
  curated: boolean
  searching: boolean
  activeTab: string
  onTabChange: (tab: string) => void
  onClearFilters: () => void
}) {
  const visibleNfts = curated
    ? [...nfts].sort((a, b) => rank(a.id) - rank(b.id))
    : nfts

  return (
    <section id="catalogo-mobile" aria-label="Catálogo de NFTs" className="mt-4 scroll-mt-20">
      {/* Os rótulos do Figma ("Todos os NFTs", "Novos lançamentos") encavalavam em 390 px; foram encurtados. As abas agora reordenam o catálogo como no desktop. */}
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(String(value))}>
        <div className="flex items-end justify-between gap-3">
          <TabsList
            variant="line"
            aria-label="Categorias de NFTs"
            className="h-auto justify-start gap-4 rounded-none p-0"
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-none rounded-none px-0 pt-0 pb-1 text-sm text-foreground after:bg-primary data-active:font-bold data-active:text-link"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {searching && !loading && (
            <p className="pb-1 text-xs text-muted-foreground" aria-live="polite">
              {total} {total === 1 ? 'resultado' : 'resultados'}
            </p>
          )}
        </div>
        <TabsContent value={activeTab} className="mt-4">
          {/* O Figma escalonava a coluna direita 32 px abaixo; com nomes e preços de alturas diferentes, as linhas desencontravam entre 375 e 425 px. A grade alinha os cards por linha. */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 sm:gap-x-4" aria-busy={loading}>
            {loading &&
              Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="aspect-square w-full rounded-2xl" />
              ))}
            {!loading && isError && (
              <StatusAlert
                className="col-span-full"
                description="Não foi possível carregar os NFTs. Tente novamente em instantes."
              />
            )}
            {!loading && !isError && visibleNfts.length === 0 && (
              <StatusAlert
                tone="empty"
                className="col-span-full"
                description="Nenhum NFT encontrado para essa busca ou filtros."
                action={<StatusAlertAction onClick={onClearFilters}>Limpar filtros</StatusAlertAction>}
              />
            )}
            {!loading &&
              !isError &&
              visibleNfts.map((nft, index) => <HomeNftCard key={nft.id} {...nft} priority={index < 2} />)}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

function rank(id: string) {
  const index = figmaMobileOrder.indexOf(id)
  return index < 0 ? figmaMobileOrder.length : index
}
