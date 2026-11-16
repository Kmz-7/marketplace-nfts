import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { HomeCatalogFilters } from '@/pages/home/components/home-catalog-filters'
import type { MobileCatalogFilters } from '@/pages/home/components/mobile-home'

/** O Figma mobile só desenha o botão de filtro; a tela cheia traz os mesmos filtros da lateral do desktop, no padrão das sobreposições mobile (scan, menu do perfil). */
export function MobileHomeFiltersDialog({
  open,
  onOpenChange,
  filters,
  resultCount,
  activeFilterCount,
  onClearFilters,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: MobileCatalogFilters
  resultCount: number
  activeFilterCount: number
  onClearFilters: () => void
}) {
  // Remonta os filtros ao limpar para o controle de preço voltar à faixa padrão.
  const [resetKey, setResetKey] = useState(0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        variant="fullscreen"
        closeLabel="Fechar filtros"
        className="flex flex-col overflow-hidden bg-background/90 backdrop-blur-md"
        overlayClassName="bg-background/40 backdrop-blur-sm"
      >
        {/* Só a lista rola; título e ações ficam fixos nas bordas da tela. */}
        <header className="px-7 pt-6">
          <div className="flex h-11 items-center justify-center px-11">
            <DialogTitle className="text-center text-xl font-bold">Filtros</DialogTitle>
          </div>
          <DialogDescription className="mt-2 text-center text-sm">
            Refine o catálogo por coleção, preço e rede.
          </DialogDescription>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-7 pt-6 pb-6">
          <HomeCatalogFilters key={resetKey} layout="sheet" {...filters} />
        </div>
        <footer className="flex gap-3 px-7 pt-4 pb-8">
          <Button
            type="button"
            variant="surface"
            className="h-12 flex-1 text-sm"
            disabled={activeFilterCount === 0}
            onClick={() => {
              onClearFilters()
              setResetKey((key) => key + 1)
            }}
          >
            Limpar
          </Button>
          <DialogClose render={<Button type="button" variant="gradient" className="h-12 flex-[2] text-sm" />}>
            Ver {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
          </DialogClose>
        </footer>
      </DialogContent>
    </Dialog>
  )
}
