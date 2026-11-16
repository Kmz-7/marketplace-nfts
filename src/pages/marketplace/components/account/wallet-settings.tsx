import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label, RequiredMark } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const walletFields = [
  'Apelido da carteira',
  'Rede',
  'Endereço da carteira',
  'Tipo de carteira',
  'Nome ENS',
]

function WalletField({ field }: { field: string }) {
  const id = `wallet-${field}`
  if (field !== 'Rede' && field !== 'Tipo de carteira') {
    const inputId = field.toLocaleLowerCase('pt-BR').replaceAll(' ', '-')
    return (
      <div className="space-y-2">
        <Label htmlFor={inputId}>
          {field}
          <RequiredMark />
        </Label>
        <Input id={inputId} variant="account" />
      </div>
    )
  }

  const options =
    field === 'Rede'
      ? [
          ['ethereum', 'Ethereum'],
          ['polygon', 'Polygon'],
        ]
      : [
          ['metamask', 'MetaMask'],
          ['walletconnect', 'WalletConnect'],
          ['coinbase', 'Coinbase Wallet'],
        ]

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {field}
        <RequiredMark />
      </Label>
      <Select defaultValue={field === 'Rede' ? 'ethereum' : 'coinbase'}>
        <SelectTrigger variant="account" id={id}>
          <SelectValue placeholder={`Selecione ${field.toLocaleLowerCase('pt-BR')}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(([value, name]) => (
            <SelectItem key={value} value={value}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function WalletSettings() {
  return (
    <section aria-labelledby="wallet-settings-title">
      {/* O botão "Adicionar carteira" do topo repetia a ação do card de carteira secundária; ficou só no card. */}
      <div className="mb-6">
        {/* No mobile, o cabeçalho da página já mostra "Carteiras"; o título repetido fica só no desktop. */}
        <h2 id="wallet-settings-title" className="hidden text-lg font-semibold md:block">
          Carteiras
        </h2>
        <p className="text-md text-muted-foreground md:mt-2">
          Gerencie as carteiras usadas para comprar e receber NFTs.
        </p>
      </div>
      <Card className="gap-0 rounded-sm border-0 bg-card p-5 shadow-none ring-0">
        <CardContent className="p-0">
          <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="text-lg font-semibold">Carteira principal</h3>
              <p className="mt-1 text-xs text-muted-foreground">Selecionada para pagamentos</p>
            </div>
            <Badge variant="outline" className="border-primary text-primary">
              Principal
            </Badge>
          </div>
          <form
            onSubmit={(event) => event.preventDefault()}
            className="grid gap-x-6 gap-y-5 sm:grid-cols-2"
          >
            {walletFields.map((field) => (
              <WalletField key={field} field={field} />
            ))}
          </form>
          <Button type="button" width="mobile" className="mt-6 h-10 px-8">
            Salvar carteira
          </Button>
        </CardContent>
      </Card>
      <Card className="mt-6 gap-0 rounded-sm border border-border bg-transparent p-5 shadow-none ring-0">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-0">
          <div>
            <h3 className="text-lg font-semibold">Carteira secundária</h3>
            <p className="mt-1 text-md text-muted-foreground">
              Você ainda não adicionou uma carteira secundária.
            </p>
          </div>
          <Button type="button" variant="outline" width="mobile" className="h-10">
            Adicionar carteira
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
