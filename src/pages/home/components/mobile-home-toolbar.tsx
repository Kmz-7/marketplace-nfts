import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SlidersHorizontalIcon } from '@/components/ui/icons'

export function MobileHomeToolbar() {
  return (
    <div className="sticky top-0 z-30 -mx-4 flex gap-2 bg-background/70 px-4 py-3 backdrop-blur-md">
      <div className="relative flex-1">
        {/* No Figma, o ícone de busca era maior que o padrão dos demais campos; foi alinhado a size-4. */}
        <Search className="absolute top-3 left-3 size-4 text-muted-foreground" />
        <Input aria-label="Explorar coleções" placeholder="Explorar coleções" variant="search" />
      </div>
      <Button size="icon-lg" className="size-11 rounded-xl" aria-label="Filtros">
        <SlidersHorizontalIcon />
      </Button>
    </div>
  )
}
