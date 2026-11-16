import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type QuantityButtonProps = {
  action: 'decrease' | 'increase'
  label: string
  scale?: 'compact' | 'large'
  disabled?: boolean
  onClick: () => void
}

export function QuantityButton({
  action,
  label,
  scale = 'compact',
  disabled = false,
  onClick,
}: QuantityButtonProps) {
  const isLarge = scale === 'large'
  const Icon = action === 'decrease' ? Minus : Plus

  // No exemplo do Figma, os controles de quantidade tinham proporções estreitas e altas; os tamanhos shadcn instalados mantêm alvos de toque proporcionais.
  return (
    <Button
      type="button"
      variant="default"
      size={isLarge ? 'icon-sm' : 'icon-xs'}
      className="rounded-lg p-0 text-primary-foreground hover:bg-primary/90"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon className="size-4" />
    </Button>
  )
}
