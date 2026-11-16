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

export function CollectorProfileForm() {
  return (
    <section aria-labelledby="collector-profile-title" className="min-w-0">
      <h1 id="collector-profile-title" className="mb-4 text-xl font-semibold md:text-2xl">
        Perfil do colecionador
      </h1>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="grid gap-x-6 gap-y-5 md:grid-cols-2"
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <Label variant="checkout" htmlFor="display-name">
              Nome de exibição <RequiredMark />
            </Label>
            <Input id="display-name" variant="checkout" />
          </div>
          <div className="space-y-2">
            <Label variant="checkout" htmlFor="checkout-network">
              Rede <RequiredMark />
            </Label>
            <Select defaultValue="Selecione uma rede">
              <SelectTrigger variant="checkout" id="checkout-network">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default" disabled>
                  Selecione uma rede
                </SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
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
            <Input id="collector-email" type="email" variant="checkout" />
          </div>
          <Label variant="checkout" htmlFor="another-wallet" className="cursor-pointer">
            <Checkbox id="another-wallet" className="rounded-full border-2 border-primary" />
            <span className="ml-1 mt-3">Usar outra carteira?</span>
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
            <Input id="profile-name" variant="checkout" />
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
                <SelectTrigger aria-label="Sufixo ENS" variant="checkoutSuffix">
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
