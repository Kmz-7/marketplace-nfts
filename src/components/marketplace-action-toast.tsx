import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export type MarketplaceToastKind =
  | 'cart-added'
  | 'cart-existing'
  | 'favorite-added'
  | 'favorite-existing'
  | 'favorite-removed'

const toastCopy: Record<MarketplaceToastKind, { message: string; action: string }> = {
  'cart-added': { message: 'Item adicionado ao seu carrinho', action: 'Ir para o carrinho' },
  'cart-existing': { message: 'Este item já está no seu carrinho', action: 'Adicionar mais' },
  'favorite-added': { message: 'Item adicionado aos favoritos', action: 'Ver favoritos' },
  'favorite-existing': { message: 'Este item já está nos seus favoritos', action: 'Ver favoritos' },
  'favorite-removed': { message: 'Item removido dos favoritos', action: 'Ver favoritos' },
}

function MarketplaceActionToast({
  toastId,
  kind,
  onAction,
}: {
  toastId: string | number
  kind: MarketplaceToastKind
  onAction: () => void
}) {
  const copy = toastCopy[kind]

  return (
    /* No Figma, a borda primary chamava atenção demais e o toast era opaco; border e fundo translúcido alinham o aviso ao cabeçalho. */
    <Card
      role="status"
      className="marketplace-toast-enter relative w-[min(28rem,calc(100vw-2rem))] gap-2 rounded-lg border border-border bg-card/85 p-4 text-secondary-foreground shadow-lg ring-0 backdrop-blur-md"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Fechar mensagem"
        className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
        onClick={() => toast.dismiss(toastId)}
      >
        <X className="size-4" aria-hidden="true" />
      </Button>
      <p className="pr-8 text-xs text-secondary-foreground">{copy.message}</p>
      <Button
        type="button"
        variant="default"
        size="sm"
        className="w-fit"
        onClick={() => {
          toast.dismiss(toastId)
          onAction()
        }}
      >
        {kind === 'cart-existing' && <Plus className="size-4" aria-hidden="true" />}
        {copy.action}
        {kind === 'cart-existing' && <span className="sr-only"> ao item no carrinho</span>}
      </Button>
    </Card>
  )
}

export function showMarketplaceActionToast(
  kind: MarketplaceToastKind,
  onAction: () => void,
) {
  toast.custom(
    (toastId) => (
      <MarketplaceActionToast toastId={toastId} kind={kind} onAction={onAction} />
    ),
    { duration: 7000, position: 'bottom-right' },
  )
}
