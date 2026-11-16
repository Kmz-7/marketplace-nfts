import { X } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatEth, multiplyEth, parseEth } from '@/lib/eth'
import type { OrderContract } from '@/types/order.contracts'

export function OrderConfirmationCard({ order }: { order: OrderContract }) {
  const navigate = useNavigate()
  const transaction = order.transactionReference
  const shortTransaction = transaction
    ? `${transaction.slice(0, 8)}…${transaction.slice(-6)}`
    : '—'
  const createdAt = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(order.createdAt))

  return (
    <Card className="relative w-full max-w-lg gap-0 overflow-hidden rounded-none border-0 bg-card py-8 shadow-none ring-0">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-3 right-3 text-primary"
        aria-label="Fechar confirmação"
        onClick={() => void navigate({ to: '/' })}
      >
        <X className="size-4" />
      </Button>
      <CardContent className="p-0">
        <div className="flex flex-col items-center text-center">
          <img src="/assets/helpers/envelope.svg" alt="" className="h-20 w-[66px] object-contain" />
          <h1 className="mt-3 text-lg leading-6 font-semibold text-muted-foreground">
            Compra confirmada
          </h1>
        </div>

        <div className="relative px-6 sm:px-10">
          <div className="mt-3 grid grid-cols-2 gap-4 border-y border-primary px-1 py-3 text-xs sm:grid-cols-4">
            <ConfirmationDetail label="ID do pedido" value={order.id} />
            <ConfirmationDetail label="Data" value={createdAt} />
            <ConfirmationDetail label="Total" value={`${formatEth(parseEth(order.totalEth))} ETH`} />
            <ConfirmationDetail label="Carteira" value={order.wallet} />
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Detalhes da transação</h2>
            {/* No mobile, a tabela de 3 colunas espremia o nome ao lado da miniatura de 96 px; vira uma lista com quantidade e subtotal na base. */}
            <ul aria-label="Itens da transação" className="mt-3 space-y-3 md:hidden">
              {order.items.map((item) => (
                <li key={`${item.nftId}-${item.editionId}`} className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.name} className="image-thumbnail shrink-0 rounded-sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">ID do token:</p>
                    <p className="truncate text-xs text-primary">#{tokenNumber(item.nftId)}</p>
                    <div className="mt-2 flex items-baseline justify-between gap-2">
                      <span className="text-xs text-muted-foreground">(x {item.quantity})</span>
                      <span className="text-md font-semibold whitespace-nowrap text-primary">
                        {multiplyEth(item.unitPriceEth, item.quantity)} ETH
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Table
              aria-label="Itens da transação"
              className="hidden w-full table-fixed md:table border-separate border-spacing-x-0 border-spacing-y-2 text-xs"
            >
              <colgroup>
                <col className="w-[58%]" />
                <col className="w-[16%]" />
                <col className="w-[26%]" />
              </colgroup>
              <TableHeader>
                <TableRow className="border-0 hover:bg-transparent">
                  <TableHead className="h-auto border-b border-border p-0 pb-2 text-xs text-foreground">
                    NFTs
                  </TableHead>
                  <TableHead className="h-auto border-b border-border p-0 pb-2 text-center text-xs text-foreground">
                    Edições
                  </TableHead>
                  <TableHead className="h-auto border-b border-border p-0 pb-2 text-right text-xs text-foreground">
                    Subtotal
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={`${item.nftId}-${item.editionId}`} className="border-0 hover:bg-transparent">
                    <TableCell className="p-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="image-thumbnail shrink-0 rounded-sm"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">{item.name}</p>
                          {/* Na mesma linha, rótulo e ID não cabiam ao lado da miniatura e o ID era sempre cortado; o ID desce para a linha de baixo. */}
                          <p className="mt-1 text-xs text-muted-foreground">ID do token:</p>
                          <p className="truncate text-xs text-primary">
                            #{tokenNumber(item.nftId)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-0 text-center text-xs text-muted-foreground">
                      (x {item.quantity})
                    </TableCell>
                    <TableCell className="p-0 text-right text-md font-semibold text-primary">
                      {multiplyEth(item.unitPriceEth, item.quantity)} ETH
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Rótulos e valores ficavam em colunas separadas e desalinhavam quando um valor quebrava linha; cada linha agora pareia rótulo e valor. */}
            <dl className="mt-2 space-y-1 border-y border-border py-2 text-xs md:border-t-0">
              <SummaryRow label="Subtotal" value={`${formatEth(parseEth(order.subtotalEth))} ETH`} />
              <SummaryRow label="Desconto" value={`(−) ${formatEth(parseEth(order.discountEth))} ETH`} />
              <SummaryRow label={`Taxa de rede · ${order.network}`} value={`${formatEth(parseEth(order.networkFeeEth))} ETH`} />
              <SummaryRow label="Total" value={`${formatEth(parseEth(order.totalEth))} ETH`} highlight />
            </dl>
          </div>

          <div className="mt-2 text-center">
            <p className="text-xs leading-5 text-muted-foreground">
              Pedido confirmado no ambiente de demonstração. Referência da transação: {shortTransaction}.
            </p>
            <Button
              type="button"
              variant="outline"
              width="mobile"
              className="mt-5 mb-5 h-11 rounded-lg px-3"
              onClick={() => void navigate({ to: '/' })}
            >
              Voltar ao marketplace
            </Button>
          </div>
        </div>
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-2 bg-primary" />
    </Card>
  )
}

function tokenNumber(nftId: string) {
  return nftId.match(/(\d+)$/)?.[1]?.padStart(4, '0') ?? nftId
}

function SummaryRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={highlight ? 'font-medium text-foreground' : 'font-light text-foreground'}>{label}</dt>
      <dd className={`text-md whitespace-nowrap ${highlight ? 'text-primary' : ''}`}>{value}</dd>
    </div>
  )
}

function ConfirmationDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col text-left text-xs text-muted-foreground">
      <p className="font-semibold">{label}</p>
      <p className="mt-0.5 truncate font-normal" title={value}>{value}</p>
    </div>
  )
}
