import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type QuantityButtonProps = {
  action: 'decrease' | 'increase'
  label: string
  /** `mini`: 20 px, usado no card do carrinho mobile. */
  scale?: 'mini' | 'compact' | 'large'
  /** `surface`: botão escuro com borda, usado nos cards do carrinho mobile do Figma. */
  tone?: 'primary' | 'surface'
  disabled?: boolean
  onClick: () => void
}

export function QuantityButton({
  action,
  label,
  scale = 'compact',
  tone = 'primary',
  disabled = false,
  onClick,
}: QuantityButtonProps) {
  const isLarge = scale === 'large'
  const Icon = action === 'decrease' ? Minus : Plus

  // No exemplo do Figma, os controles de quantidade tinham proporções estreitas e altas; os tamanhos shadcn instalados mantêm alvos de toque proporcionais.
  return (
    <Button
      type="button"
      variant={tone === 'surface' ? 'surface' : 'default'}
      size={isLarge ? 'icon-sm' : 'icon-xs'}
      className={`${tone === 'surface' ? 'p-0' : 'p-0 text-primary-foreground hover:bg-primary/90'} ${scale === 'mini' ? 'size-5' : ''}`}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon className={scale === 'mini' ? 'size-3' : 'size-4'} />
    </Button>
  )
}
