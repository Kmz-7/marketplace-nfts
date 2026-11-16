import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type QuantityButtonProps = {
  action: 'decrease' | 'increase'
  label: string
  scale?: 'compact' | 'large'
  onClick: () => void
}

export function QuantityButton({ action, label, scale = 'compact', onClick }: QuantityButtonProps) {
  const isLarge = scale === 'large'
  const Icon = action === 'decrease' ? Minus : Plus

  return (
    <Button
      type="button"
      variant="default"
      size={isLarge ? 'icon-sm' : 'icon-xs'}
      className={`p-0 text-primary-foreground hover:bg-primary/90 ${
        isLarge ? 'h-[49.5px] w-8.5 rounded-[28px]' : 'h-7 w-5 rounded-full'
      }`}
      aria-label={label}
      onClick={onClick}
    >
      <Icon className={isLarge ? 'size-6' : 'size-4'} />
    </Button>
  )
}
