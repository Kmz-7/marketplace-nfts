'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const labelVariants = cva(
  'flex items-center text-sm leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'gap-2 font-medium',
        checkout: 'gap-1 font-normal',
        cartCoupon: 'mt-4 block leading-4',
        newsletterTitle: 'gap-2 text-newsletter-title leading-4 font-bold',
        walletOptionMetaMask:
          'cursor-pointer justify-start gap-3 rounded-sm border border-checkout-border bg-transparent px-4 py-3 text-sm',
        walletOptionCoinbase:
          'cursor-pointer justify-start gap-0 rounded-sm border border-checkout-border bg-transparent px-4 py-3 text-sm',
        compatibleWallets:
          'cursor-pointer justify-start gap-3 rounded-sm border border-checkout-border bg-transparent px-3 py-2',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

function Label({
  className,
  variant,
  ...props
}: React.ComponentProps<'label'> & VariantProps<typeof labelVariants>) {
  return (
    <label data-slot="label" className={cn(labelVariants({ variant }), className)} {...props} />
  )
}

function RequiredMark() {
  return (
    <span
      aria-hidden="true"
      className="text-form-required leading-none text-required-marker text-xl!"
    >
      *
    </span>
  )
}

export { Label, RequiredMark }
