import { MobileHomeCatalog } from '@/pages/home/components/mobile-home-catalog'
import { MobileHomeHero } from '@/pages/home/components/mobile-home-hero'
import { MobileHomeNavigation } from '@/pages/home/components/mobile-home-navigation'
import { MobileHomeToolbar } from '@/pages/home/components/mobile-home-toolbar'
import type { HomeCatalogFiltersProps } from '@/pages/home/components/home-catalog-filters'
import type { HomeNft } from '@/pages/home/components/home-nft-mapper'

export type MobileCatalogFilters = Omit<HomeCatalogFiltersProps, 'layout'>

export function MobileHome({
  nfts,
  total,
  loading,
  isError,
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  curated,
  filters,
  onClearFilters,
}: {
  nfts: HomeNft[]
  total: number
  loading: boolean
  isError: boolean
  searchTerm: string
  onSearchChange: (value: string) => void
  activeTab: string
  onTabChange: (tab: string) => void
  /** Sem busca, filtros ou aba ativa, a grade segue a curadoria do Figma. */
  curated: boolean
  filters: MobileCatalogFilters
  onClearFilters: () => void
}) {
  const activeFilterCount = [filters.selectedCollection, filters.selectedNetwork, filters.priceRange].filter(Boolean).length
  const searching = Boolean(searchTerm.trim()) || activeFilterCount > 0

  return (
    <main className="-mx-4 bg-background px-6 pb-28 pt-7 md:hidden">
      <MobileHomeToolbar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        filters={filters}
        activeFilterCount={activeFilterCount}
        resultCount={total}
        onClearFilters={onClearFilters}
      />
      {/* Durante a busca ou com filtros, o banner sai do caminho para os resultados aparecerem logo abaixo do campo. */}
      {!searching && <MobileHomeHero />}
      <MobileHomeCatalog
        nfts={nfts}
        total={total}
        loading={loading}
        isError={isError}
        curated={curated}
        searching={searching}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onClearFilters={onClearFilters}
      />
      <MobileHomeNavigation />
    </main>
  )
}
