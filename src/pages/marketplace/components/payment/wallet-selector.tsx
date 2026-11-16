import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type WalletSelectorProps = {
  value: string
  onValueChange: (value: string) => void
  onConfirm: () => void
}

export function WalletSelector({ value, onValueChange, onConfirm }: WalletSelectorProps) {
  return (
    <section aria-labelledby="wallet-network-title">
      <RadioGroup value={value} onValueChange={onValueChange} className="gap-3">
        <Label variant="compatibleWallets">
          <RadioGroupItem value="compatibleWallets" variant="checkout" />
          <span className="flex w-[283px] flex-row rounded-sm border border-surface-dark-border bg-surface-dark py-1 text-xs uppercase text-primary">
            <span className="px-3">MetaMask</span>
            <span className="text-muted-foreground">·</span>
            <span className="px-3">WalletConnect</span>
            <span className="text-muted-foreground">·</span>
            <span className="px-2 pe-0">Coinbase</span>
          </span>
        </Label>
        {['MetaMask', 'Coinbase Wallet'].map((wallet) => (
          <Label
            key={wallet}
            variant={wallet === 'MetaMask' ? 'walletOptionMetaMask' : 'walletOptionCoinbase'}
          >
            <RadioGroupItem
              value={wallet === 'MetaMask' ? 'metamask' : 'coinbase'}
              variant="checkout"
            />
            <span
              className={
                wallet === 'MetaMask'
                  ? 'mt-1 flex flex-1 items-center'
                  : 'mt-1 ms-7 flex flex-1 items-center'
              }
            >
              {wallet}
            </span>
          </Label>
        ))}
      </RadioGroup>
      <Button type="button" onClick={onConfirm} className="mt-4 h-10 w-full rounded-lg text-sm">
        Confirmar compra
      </Button>
    </section>
  )
}
