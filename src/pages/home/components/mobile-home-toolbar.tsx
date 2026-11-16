import { lazy, Suspense, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SlidersHorizontalIcon } from '@/components/ui/icons'
import type { MobileCatalogFilters } from '@/pages/home/components/mobile-home'

const MobileHomeFiltersDialog = lazy(() =>
  import('@/pages/home/components/mobile-home-filters-dialog').then((module) => ({
    default: module.MobileHomeFiltersDialog,
  })),
)

export function MobileHomeToolbar({
  searchTerm,
  onSearchChange,
  filters,
  activeFilterCount,
  resultCount,
  onClearFilters,
}: {
  searchTerm: string
  onSearchChange: (value: string) => void
  filters: MobileCatalogFilters
  activeFilterCount: number
  resultCount: number
  onClearFilters: () => void
}) {
  const [filtersLoaded, setFiltersLoaded] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="sticky top-0 z-30 -mx-4 flex gap-2 bg-background/70 px-4 py-3 backdrop-blur-md">
      <div role="search" className="relative flex-1">
        {/* No Figma, o ícone de busca era maior que o padrão dos demais campos; foi alinhado a size-4. */}
        <Search className="absolute top-3.5 left-3.5 size-4 text-muted-foreground/70" aria-hidden="true" />
        <Input
          type="search"
          aria-label="Explorar coleções"
          placeholder="Explorar coleções"
          variant="searchMobile"
          className="pr-10 [&::-webkit-search-cancel-button]:hidden"
          value={searchTerm}
          enterKeyHint="search"
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Limpar busca"
            className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
            onClick={() => onSearchChange('')}
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <Button
        type="button"
        variant="gradient"
        size="icon-lg"
        className="relative size-11"
        aria-label={activeFilterCount ? `Filtros (${activeFilterCount} ativos)` : 'Filtros'}
        aria-haspopup="dialog"
        aria-expanded={filtersOpen}
        onClick={() => {
          // Controles de filtro pesados só entram no bundle mobile quando o cliente abre o painel.
          setFiltersLoaded(true)
          setFiltersOpen(true)
        }}
      >
        <SlidersHorizontalIcon />
        {activeFilterCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background"
          >
            {activeFilterCount}
          </span>
        )}
      </Button>
      {filtersLoaded && (
        <Suspense fallback={null}>
          <MobileHomeFiltersDialog
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            filters={filters}
            resultCount={resultCount}
            activeFilterCount={activeFilterCount}
            onClearFilters={onClearFilters}
          />
        </Suspense>
      )}
    </div>
  )
}
