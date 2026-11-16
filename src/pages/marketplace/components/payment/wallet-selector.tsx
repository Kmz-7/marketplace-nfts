import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CompatibleWallets } from '@/components/compatible-wallets'

type WalletSelectorProps = {
  value: string
  onValueChange: (value: string) => void
  onConfirm: () => void
}

export function WalletSelector({ value, onValueChange, onConfirm }: WalletSelectorProps) {
  return (
    <section aria-labelledby="wallet-network-title" className="space-y-3">
      {/* No Figma, o título ficava distante das opções; o bloco agora antecede o selo e os controles. */}
      <h2 id="wallet-network-title" className="text-lg font-semibold">
        Carteira e rede
      </h2>
      {/* MetaMask · WalletConnect · Coinbase indica compatibilidade, não uma carteira selecionável. */}
      <CompatibleWallets className="mx-auto w-full max-w-[283px]" />
      <RadioGroup value={value} onValueChange={onValueChange} className="gap-3">
        {['MetaMask', 'Coinbase Wallet'].map((wallet) => (
          <Label key={wallet} variant="walletOption">
            <RadioGroupItem
              value={wallet === 'MetaMask' ? 'metamask' : 'coinbase'}
              variant="checkout"
            />
            <span className="flex flex-1 items-center">{wallet}</span>
          </Label>
        ))}
      </RadioGroup>
      <Button type="button" onClick={onConfirm} className="mt-4 h-10 w-full rounded-lg text-sm">
        Confirmar compra
      </Button>
    </section>
  )
}
