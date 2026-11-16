import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { StatusAlert, StatusAlertAction } from '@/components/status-alert'
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
import { multiplyEth } from '@/lib/eth'

export type CartItem = CartEntry

type CartItemsSectionProps = {
  items: CartItem[]
  onQuantityChange: (id: string, amount: number) => void
  onRemove: (id: string) => void
}

function QuantityControl({
  item,
  onQuantityChange,
  tone,
}: {
  item: CartItem
  onQuantityChange: (id: string, amount: number) => void
  tone?: 'primary' | 'surface'
}) {
  const scale = tone === 'surface' ? 'mini' : 'compact'
  return (
    <div className={`flex items-center ${tone === 'surface' ? 'gap-1.5' : 'gap-2'}`}>
      {/* No Figma, o menos continuava ativo na quantidade mínima; desabilitar em 1 evita tentar zerar o item, que sai pela lixeira. */}
      <QuantityButton
        action="decrease"
        label={`Diminuir quantidade de ${item.name}`}
        tone={tone}
        scale={scale}
        disabled={item.quantity <= 1}
        onClick={() => onQuantityChange(item.lineId, -1)}
      />
      <span className="min-w-4 text-center text-md leading-4 text-foreground">{item.quantity}</span>
      <QuantityButton
        action="increase"
        label={`Aumentar quantidade de ${item.name}`}
        tone={tone}
        scale={scale}
        disabled={item.availableQuantity !== undefined && item.quantity >= item.availableQuantity}
        onClick={() => onQuantityChange(item.lineId, 1)}
      />
    </div>
  )
}

function RemoveCartButton({
  item,
  onRemove,
  compact = false,
}: {
  item: CartItem
  onRemove: (id: string) => void
  compact?: boolean
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size={compact ? 'icon-xs' : 'icon-sm'}
      aria-label={`Remover ${item.name}`}
      onClick={() => onRemove(item.lineId)}
      className={`text-muted-foreground hover:text-foreground ${compact ? 'absolute top-1.5 right-1.5' : ''}`}
    >
      {/* No Figma, a lixeira estava maior que o ícone equivalente na versão mobile; a versão compacta do card mobile usa size-3.5. */}
      <img src="/assets/helpers/trash.svg" alt="" aria-hidden="true" className={compact ? 'size-3.5' : 'size-4'} />
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
          <TableRow key={item.lineId} className="border-0 bg-card hover:bg-card">
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
                {multiplyEth(item.price, item.quantity)} ETH
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
    <div className="space-y-5 lg:hidden">
      {items.map((item) => (
        <Card key={item.lineId} className="gap-0 rounded-xl border-0 bg-card p-0 shadow-lg ring-0">
          {/* No Figma mobile, a arte encosta na borda esquerda do card; a miniatura mantém 96 px (o Figma usa 100 px) para seguir pagamento e confirmação. */}
          <CardContent className="relative flex items-center gap-3 p-0 pr-3">
            <img src={item.image} alt={item.name} className="image-thumbnail" />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h2 className="truncate text-sm leading-5 font-bold">{item.name}</h2>
              <p className="text-sm leading-4 text-muted-foreground">Edição: {item.edition}</p>
              {/* A quantidade fica na base do card, alinhada ao preço e encostada à direita. */}
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="whitespace-nowrap text-lg leading-5 font-bold text-link">{item.price} ETH</p>
                <QuantityControl item={item} onQuantityChange={onQuantityChange} tone="surface" />
              </div>
            </div>
            {/* O Figma mostrava a lixeira apenas em um item, sobreposta ao "+"; todos os itens a exibem compacta no canto superior direito. */}
            <RemoveCartButton item={item} onRemove={onRemove} compact />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function CartItemsSection({
  items,
  onQuantityChange,
  onRemove,
  mobileFrame = false,
}: CartItemsSectionProps & { mobileFrame?: boolean }) {
  return (
    <section aria-label="NFTs no carrinho" className="min-w-0">
      {/* O Figma variava o tamanho do título do carrinho; títulos de página usam lg em todos os tamanhos. */}
      {!mobileFrame && <h1 className="mb-2 text-lg leading-5 font-semibold lg:hidden">NFTs</h1>}
      {/* No Figma, o estado vazio ficava colado ao breadcrumb; mt-4 alinha o card ao resumo lateral. */}
      {items.length === 0 ? (
        <StatusAlert
          tone="empty"
          className="mt-4"
          description="Seu carrinho está vazio."
          action={<StatusAlertAction render={<Link to="/" hash="catalogo" />}>Explorar catálogo</StatusAlertAction>}
        />
      ) : (
        <>
          {!mobileFrame && (
            <DesktopCartRows items={items} onQuantityChange={onQuantityChange} onRemove={onRemove} />
          )}
          <MobileCartRows items={items} onQuantityChange={onQuantityChange} onRemove={onRemove} />
        </>
      )}
    </section>
  )
}
