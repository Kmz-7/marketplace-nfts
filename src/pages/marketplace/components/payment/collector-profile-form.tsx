import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label, RequiredMark } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/hooks/use-auth'

export function CollectorProfileForm({
  network,
  onNetworkChange,
}: {
  network: 'ethereum' | 'polygon' | 'solana'
  onNetworkChange: (network: 'ethereum' | 'polygon' | 'solana') => void
}) {
  const session = useSession()
  const user = session.data?.user
  const [profileOverrides, setProfileOverrides] = useState<{
    displayName?: string
    email?: string
    profileName?: string
  }>({})
  const profileValues = {
    displayName: profileOverrides.displayName ?? user?.name ?? '',
    email: profileOverrides.email ?? user?.email ?? '',
    profileName: profileOverrides.profileName ?? user?.name ?? '',
  }

  return (
    <section aria-labelledby="collector-profile-title" className="min-w-0">
      {/* O Figma usava escalas diferentes no título do formulário; ele acompanha os títulos lg do restante do checkout. */}
      <h1 id="collector-profile-title" className="mb-4 text-lg font-semibold">
        Perfil do colecionador
      </h1>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="grid gap-x-6 gap-y-5 md:grid-cols-2"
      >
        {/* O Figma não diferenciava os dados do perfil no checkout; nome e e-mail existentes na sessão preenchem os campos equivalentes. */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label variant="checkout" htmlFor="display-name">
              Nome de exibição <RequiredMark />
            </Label>
            <Input
              id="display-name"
              variant="checkout"
              value={profileValues.displayName}
              onChange={(event) =>
                setProfileOverrides((current) => ({ ...current, displayName: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label variant="checkout" htmlFor="checkout-network">
              Rede <RequiredMark />
            </Label>
            <Select value={network} onValueChange={(value) => onNetworkChange(value as typeof network)}>
              <SelectTrigger variant="checkout" id="checkout-network">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label variant="checkout" htmlFor="wallet-address">
              Endereço da carteira <RequiredMark />
            </Label>
            <Input id="wallet-address" variant="checkout" placeholder="Endereço 0x da carteira" />
          </div>
          <div className="space-y-2">
            <Label variant="checkout" htmlFor="wallet-type">
              Tipo de carteira <RequiredMark />
            </Label>
            <Select defaultValue="Selecione uma carteira">
              <SelectTrigger variant="checkout" id="wallet-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metamask">MetaMask</SelectItem>
                <SelectItem value="walletconnect">WalletConnect</SelectItem>
                <SelectItem value="coinbase">Coinbase Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label variant="checkout" htmlFor="collector-email">
              E-mail <RequiredMark />
            </Label>
            <Input
              id="collector-email"
              type="email"
              variant="checkout"
              value={profileValues.email}
              onChange={(event) =>
                setProfileOverrides((current) => ({ ...current, email: event.target.value }))
              }
            />
          </div>
          <Label variant="checkout" htmlFor="another-wallet" className="cursor-pointer gap-3">
            {/* No Figma, este controle era mais pesado e o texto ficava desalinhado; círculo e alinhamento seguem Carteira e rede. */}
            <Checkbox id="another-wallet" className="rounded-full border-primary" />
            <span>Usar outra carteira?</span>
          </Label>
          <div className="space-y-2">
            <Label variant="checkout" htmlFor="collector-note">
              Observação do colecionador (opcional)
            </Label>
            <Textarea id="collector-note" variant="checkout" />
          </div>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label variant="checkout" htmlFor="username">
              Nome de usuário <RequiredMark />
            </Label>
            <Input id="username" variant="checkout" />
          </div>
          <div className="space-y-2">
            <Label variant="checkout" htmlFor="profile-name">
              Nome do perfil <RequiredMark />
            </Label>
            <Input
              id="profile-name"
              variant="checkout"
              value={profileValues.profileName}
              onChange={(event) =>
                setProfileOverrides((current) => ({ ...current, profileName: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="mt-10" variant="checkout" htmlFor="secondary-wallet"></Label>
            <Input
              id="secondary-wallet"
              variant="checkout"
              placeholder="ENS ou carteira secundária (opcional)"
            />
          </div>
          <div className="space-y-2">
            <Label variant="checkout" htmlFor="referral-code">
              Código de indicação <RequiredMark />
            </Label>
            <Input id="referral-code" variant="checkout" />
          </div>
          <div className="space-y-2">
            <Label variant="checkout" htmlFor="ens-name">
              Nome ENS <RequiredMark />
            </Label>
            <div className="flex">
              <Select defaultValue="eth">
                {/* O Figma mostrava o seletor ENS estreito e com raios diferentes; ele usa a mesma largura e forma dos outros selects. */}
                <SelectTrigger aria-label="Sufixo ENS" variant="checkout">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eth">.eth</SelectItem>
                  <SelectItem value="xyz">.xyz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}
