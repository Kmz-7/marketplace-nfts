import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CompatibleWallets } from '@/components/compatible-wallets'

type WalletSelectorProps = {
  value: 'metamask' | 'walletconnect' | 'coinbase'
  onValueChange: (value: 'metamask' | 'walletconnect' | 'coinbase') => void
  onConfirm: () => void
  pending?: boolean
  disabled?: boolean
}

export function WalletSelector({
  value,
  onValueChange,
  onConfirm,
  pending = false,
  disabled = false,
}: WalletSelectorProps) {
  return (
    <section aria-labelledby="wallet-network-title" className="space-y-3">
      {/* No Figma, o título ficava distante das opções; o bloco agora antecede o selo e os controles. */}
      <h2 id="wallet-network-title" className="text-lg font-semibold">
        Carteira e rede
      </h2>
      {/* MetaMask · WalletConnect · Coinbase indica compatibilidade, não uma carteira selecionável. */}
      <CompatibleWallets className="mx-auto w-full max-w-[283px]" />
      <RadioGroup
        value={value}
        onValueChange={(nextValue) => onValueChange(nextValue as 'metamask' | 'walletconnect' | 'coinbase')}
        className="gap-3"
        disabled={pending || disabled}
      >
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
      <Button
        type="button"
        onClick={onConfirm}
        disabled={pending || disabled}
        className="mt-4 h-10 w-full rounded-lg text-sm"
      >
        {pending ? 'Processando…' : 'Confirmar compra'}
      </Button>
    </section>
  )
}
