import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { QuantityButton } from '@/components/ui/quantity-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CartEntry } from '@/components/providers/marketplace-state-provider'

export type CartItem = CartEntry

type CartItemsSectionProps = {
  items: CartItem[]
  onQuantityChange: (id: string, amount: number) => void
  onRemove: (id: string) => void
}

function QuantityControl({
  item,
  onQuantityChange,
}: {
  item: CartItem
  onQuantityChange: (id: string, amount: number) => void
}) {
  return (
    <div className="flex items-center gap-2">
      {/* No Figma, o menos continuava ativo na quantidade mínima; desabilitar em 1 evita tentar zerar o item, que sai pela lixeira. */}
      <QuantityButton
        action="decrease"
        label={`Diminuir quantidade de ${item.name}`}
        disabled={item.quantity <= 1}
        onClick={() => onQuantityChange(item.id, -1)}
      />
      <span className="min-w-4 text-center text-md leading-4 text-foreground">{item.quantity}</span>
      <QuantityButton
        action="increase"
        label={`Aumentar quantidade de ${item.name}`}
        onClick={() => onQuantityChange(item.id, 1)}
      />
    </div>
  )
}

function RemoveCartButton({ item, onRemove }: { item: CartItem; onRemove: (id: string) => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={`Remover ${item.name}`}
      onClick={() => onRemove(item.id)}
      className="text-muted-foreground hover:text-foreground"
    >
      {/* No Figma, a lixeira estava maior que o ícone equivalente na versão mobile; ambas usam size-4. */}
      <img src="/assets/helpers/trash.svg" alt="" aria-hidden="true" className="size-4" />
    </Button>
  )
}

function DesktopCartRows({ items, onQuantityChange, onRemove }: CartItemsSectionProps) {
  return (
    <div className="hidden lg:block">
      <Table
        aria-label="NFTs no carrinho"
        className="w-full min-w-[744px] table-fixed border-separate border-spacing-x-0 border-spacing-y-3 text-sm"
      >
        <colgroup>
          <col className="w-[300px]" />
          <col className="w-[120px]" />
          <col className="w-[120px]" />
          <col className="w-[150px]" />
          <col className="w-[42px]" />
        </colgroup>
        <TableHeader>
          <TableRow className="border-0 text-start hover:bg-transparent">
            <TableHead className="h-auto border-b border-border p-0 pb-3 pl-0 text-md font-semibold">
              NFTs
            </TableHead>
            <TableHead className="h-auto border-b border-border p-0 pb-3">Preço</TableHead>
            <TableHead className="h-auto border-b border-border p-0 pb-3">Edições</TableHead>
            <TableHead className="h-auto border-b border-border p-0 pb-3 pr-[52px]">
              Total
            </TableHead>
            <TableHead className="h-auto border-b border-border p-0 pb-3" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="border-0 bg-card hover:bg-card">
              {/* No Figma, títulos equivalentes no carrinho usavam fontes divergentes; ambos usam lg. */}
              <TableCell className="rounded-l-sm p-0 py-[3px]">
                <div className="flex min-w-0 items-center gap-3.5">
                  <img src={item.image} alt={item.name} className="image-thumbnail rounded-sm" />
                  <div className="min-w-0 text-start">
                    <h2 className="truncate text-lg leading-5 font-semibold text-foreground">
                      {item.name}
                    </h2>
                    <p className="mt-1 text-xs leading-4 text-muted-foreground">
                      ID do token: <span className="text-primary">{item.tokenId}</span>
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="p-0 py-[3px] text-start text-md leading-4 text-muted-foreground">
                {item.price} ETH
              </TableCell>
              <TableCell className="p-0 py-[3px]">
                <QuantityControl item={item} onQuantityChange={onQuantityChange} />
              </TableCell>
              <TableCell className="p-0 py-[3px] pr-[52px] text-start leading-4 font-medium text-primary">
                {(Number(item.price) * item.quantity).toFixed(2)} ETH
              </TableCell>
              <TableCell className="rounded-r-sm p-0 py-[3px]">
                <RemoveCartButton item={item} onRemove={onRemove} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function MobileCartRows({ items, onQuantityChange, onRemove }: CartItemsSectionProps) {
  return (
    <div className="space-y-3 lg:hidden">
      {items.map((item) => (
        <Card key={item.id} className="gap-0 rounded-lg border-0 bg-card p-3 shadow-none ring-0">
          <CardContent className="p-0">
            <div className="flex items-center gap-2">
              <img src={item.image} alt={item.name} className="image-thumbnail rounded-sm" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg leading-5 font-semibold">{item.name}</h2>
                <p className="mt-1 text-xs leading-4 text-muted-foreground">
                  ID do token: <span className="text-primary">{item.tokenId}</span>
                </p>
              </div>
              <RemoveCartButton item={item} onRemove={onRemove} />
            </div>
            <div className="mt-3 flex items-center justify-between text-md">
              <span className="text-muted-foreground">{item.price} ETH</span>
              <QuantityControl item={item} onQuantityChange={onQuantityChange} />
              <span className="font-medium text-primary">
                {(Number(item.price) * item.quantity).toFixed(2)} ETH
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function CartItemsSection({ items, onQuantityChange, onRemove }: CartItemsSectionProps) {
  return (
    <section aria-label="NFTs no carrinho" className="min-w-0">
      {/* O Figma variava o tamanho do título do carrinho; títulos de página usam lg em todos os tamanhos. */}
      <h1 className="mb-2 text-lg leading-5 font-semibold lg:hidden">NFTs</h1>
      {/* No Figma, o estado vazio ficava colado ao breadcrumb; mt-4 alinha o card ao resumo lateral. */}
      {items.length === 0 ? (
        <Card className="mt-4 items-center gap-3 rounded-lg border border-border bg-card p-6 text-center shadow-none">
          <CardContent className="space-y-3 p-0">
            <p className="text-md text-secondary-foreground">Seu carrinho está vazio.</p>
            <Button render={<Link to="/" hash="catalogo" />}>Explorar catálogo</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <DesktopCartRows items={items} onQuantityChange={onQuantityChange} onRemove={onRemove} />
          <MobileCartRows items={items} onQuantityChange={onQuantityChange} onRemove={onRemove} />
        </>
      )}
    </section>
  )
}
