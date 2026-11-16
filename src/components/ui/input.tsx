import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Input as InputPrimitive } from '@base-ui/react/input'
import { cn } from 'cn'

const inputVariants = cva(
  'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      variant: {
        default: '',
        sidebar: 'h-8 bg-background shadow-none',
        groupAddon:
          'flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent',
        search: 'h-11 rounded-xl border-0 bg-card pl-11 text-xs',
        newsletter:
          'h-10 flex-1 rounded-l-sm rounded-r-none border-0 bg-surface-dark text-xs dark:bg-surface-dark',
        cartCoupon: 'h-10 rounded-lg border-primary bg-card px-3 text-sm leading-4',
        checkout:
          'h-10 rounded-sm border-checkout-border bg-transparent text-sm text-muted-foreground dark:bg-transparent',
        checkoutEns:
          'h-10 min-w-0 rounded-l-sm rounded-r-none border-checkout-border bg-transparent text-sm text-muted-foreground dark:bg-transparent',
        checkoutCoupon:
          'h-9 min-w-0 rounded-r-none border-checkout-border bg-transparent text-sm text-muted-foreground dark:bg-transparent',
        auth: 'h-12',
        account: 'h-10 rounded-sm border-border',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

function Input({
  className,
  type,
  variant,
  ...props
}: React.ComponentProps<'input'> & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Input }
