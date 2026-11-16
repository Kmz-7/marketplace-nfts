import { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusAlert } from '@/components/status-alert'
import { Label } from '@/components/ui/label'
import { WalletIcon } from '@/components/ui/icons'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MobileMarketplaceHeader } from '@/pages/marketplace/components/mobile-marketplace-header'

type PaymentWallet = 'metamask' | 'walletconnect' | 'coinbase'
type SavedWalletId = 'reserve' | 'primary'

const savedWallets: Array<{
  id: SavedWalletId
  title: string
  address: string
  network: string
}> = [
  { id: 'reserve', title: 'Reserva', address: 'nova.kurio.eth', network: 'Rede Polygon' },
  {
    id: 'primary',
    title: 'Principal',
    address: '0xA91F...E82C',
    network: 'Rede principal Ethereum',
  },
]

const paymentWallets: Array<{ id: PaymentWallet; name: string; shortName: string }> = [
  { id: 'walletconnect', name: 'WalletConnect', shortName: 'W' },
  { id: 'metamask', name: 'MetaMask', shortName: 'M' },
  { id: 'coinbase', name: 'Coinbase Wallet', shortName: 'C' },
]

export function MobilePaymentView({
  totalEth,
  quotePending,
  quoteError,
  value,
  onValueChange,
  onConfirm,
  onBack,
  pending = false,
  disabled = false,
}: {
  totalEth?: string
  quotePending: boolean
  quoteError?: string
  value: PaymentWallet
  onValueChange: (value: PaymentWallet) => void
  onConfirm: () => void
  onBack: () => void
  pending?: boolean
  disabled?: boolean
}) {
  const [selectedAccount, setSelectedAccount] = useState<SavedWalletId>('reserve')

  return (
    <main className="-mx-4 flex min-h-dvh flex-col bg-background px-7 pt-6 md:hidden">
      {/* Mobile/Pagamento organiza as carteiras conectadas antes do método e mantém a confirmação presa à base da tela. */}
      <MobileMarketplaceHeader title="Pagamento com carteira" onBack={onBack} />
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pt-6 pb-36">
        {/* O Figma deixava 12–16 px irregulares entre títulos e opções; cada seção usa título + 12 px + opções, com 24 px entre seções. */}
        <section aria-labelledby="connected-wallets-title" className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="connected-wallets-title" className="text-md font-bold">
              Carteira conectada
            </h2>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm font-bold text-link"
              onClick={() => setSelectedAccount((current) => current === 'reserve' ? 'primary' : 'reserve')}
            >
              Trocar carteira
            </Button>
          </div>
          <RadioGroup
            value={selectedAccount}
            onValueChange={(next) => setSelectedAccount(next as SavedWalletId)}
            aria-label="Selecionar carteira conectada"
            className="gap-3"
          >
            {savedWallets.map((wallet) => (
              <Label
                key={wallet.id}
                variant="walletOption"
                className="min-h-24 w-full items-center gap-4 rounded-xl border-0 bg-card px-4 py-3 shadow-lg"
              >
                <RadioGroupItem value={wallet.id} variant="checkout" />
                <span className="min-w-0 flex-1">
                  <span className="block text-md font-bold text-foreground">{wallet.title}</span>
                  <span className="mt-1 block truncate text-sm leading-5.5 text-muted-foreground">
                    {wallet.address}
                  </span>
                  <span className="block text-sm leading-5.5 text-muted-foreground">{wallet.network}</span>
                </span>
                <MoreVertical className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Label>
            ))}
          </RadioGroup>
        </section>

        <section aria-labelledby="payment-wallet-title" className="space-y-3">
          <h2 id="payment-wallet-title" className="text-md font-bold">
            Carteira e rede
          </h2>
          {/* O selo "MetaMask · WalletConnect · Coinbase" não existe no Figma mobile; as próprias opções já listam as carteiras. */}
          <RadioGroup
            value={value}
            onValueChange={(next) => onValueChange(next as PaymentWallet)}
            aria-label="Selecionar carteira de pagamento"
            className="gap-3"
          >
            {/* No Figma mobile, o rádio fica à direita e a marca da carteira à esquerda; Coinbase usa o ícone de carteira. */}
            {paymentWallets.map((wallet) => (
              <Label
                key={wallet.id}
                variant="walletOption"
                className="min-h-16 w-full items-center rounded-xl border-0 bg-card px-3.5 py-3 shadow-lg"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-surface-dark-border bg-surface-raised text-sm font-bold text-link">
                  {wallet.id === 'coinbase' ? <WalletIcon className="size-4" aria-hidden="true" /> : wallet.shortName}
                </span>
                <span className="flex-1 text-sm text-foreground">{wallet.name}</span>
                <RadioGroupItem value={wallet.id} variant="checkout" />
              </Label>
            ))}
          </RadioGroup>
        </section>

        {/* No Figma, o total ficava solto à direita; um card destacado fecha o resumo antes da confirmação. */}
        <Card className="gap-0 rounded-xl border border-primary/30 p-0 shadow-lg ring-0 surface-gradient">
          <CardContent className="flex items-center justify-between gap-4 px-4 py-4">
            <span className="space-y-1">
              <span className="block text-md font-bold text-foreground">Total</span>
              <span className="block text-xs text-muted-foreground">Taxa de rede inclusa</span>
            </span>
            <span className="text-xl font-bold whitespace-nowrap text-link" aria-live="polite">
              {quotePending ? '—' : `${totalEth ?? '—'} ETH`}
            </span>
          </CardContent>
        </Card>
        {quoteError && (
          <StatusAlert description={quoteError} />
        )}
      </div>
      <aside className="fixed inset-x-0 bottom-0 z-30 bg-background px-7 pt-4 pb-8">
        {/* O Figma usa CTA em pílula de 60 px; o projeto mantém rounded-lg. */}
        <Button
          type="button"
          variant="gradient"
          size="cta"
          onClick={onConfirm}
          disabled={pending || disabled || Boolean(quoteError)}
        >
          {pending ? 'Processando…' : 'Confirmar compra'}
        </Button>
      </aside>
    </main>
  )
}
