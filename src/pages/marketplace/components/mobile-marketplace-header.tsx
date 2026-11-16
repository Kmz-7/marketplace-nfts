import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

type MobileMarketplaceHeaderProps = {
  title?: string
  action?: ReactNode
  onBack: () => void
}

export function MobileMarketplaceHeader({
  title,
  action,
  onBack,
}: MobileMarketplaceHeaderProps) {
  return (
    <header className="relative flex h-11 items-center justify-center md:hidden">
      <Button
        type="button"
        variant="surface"
        size="icon-lg"
        aria-label="Voltar"
        className="absolute top-1/2 left-0 z-10 -translate-y-1/2 text-muted-foreground shadow-lg"
        onClick={onBack}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </Button>
      {/* No Figma, o título ficava deslocado à direita do botão voltar; o voltar flutua sobre o cabeçalho e o título é centralizado na largura toda. */}
      {title && <h1 className="w-full truncate px-11 text-center text-xl font-bold">{title}</h1>}
      {action && <div className="absolute top-1/2 right-0 z-10 -translate-y-1/2">{action}</div>}
    </header>
  )
}
