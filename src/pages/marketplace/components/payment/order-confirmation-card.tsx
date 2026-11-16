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
import { items } from '@/pages/marketplace/marketplace-data'

const purchasedItems = [
  { ...items[0], tokenId: '#0042', quantity: 2 },
  { ...items[1], tokenId: '#0314', quantity: 6 },
  { ...items[2], tokenId: '#0088', quantity: 9 },
]

export function OrderConfirmationCard() {
  const navigate = useNavigate()

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
        <X />
      </Button>
      <CardContent className="p-0">
        <div className="flex flex-col items-center text-center">
          <img src="/assets/helpers/envelope.svg" alt="" className="h-20 w-[66px] object-contain" />
          <h1 className="mt-3 text-lg leading-6 font-semibold text-muted-foreground">
            Seus NFTs agora estão na sua carteira
          </h1>
        </div>

        <div className="relative px-10">
          <div className="mt-3 -mx-10 flex items-center justify-between border-y border-primary px-10 py-3 text-xs">
            <ConfirmationDetail label="ID da transação" value="0xA91F...E82C" />
            <DetailDivider />
            <ConfirmationDetail label="Data" value="29 Jul, 2026" />
            <DetailDivider />
            <ConfirmationDetail label="Total" value="26.846 ETH" />
            <DetailDivider />
            <ConfirmationDetail label="Carteira" value="MetaMask" />
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Detalhes da transação</h2>
            <Table
              aria-label="Itens da transação"
              className="w-full table-fixed border-separate border-spacing-x-0 border-spacing-y-2 text-xs"
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
                {purchasedItems.map((item, index) => (
                  <TableRow key={item.name} className="border-0 hover:bg-transparent">
                    <TableCell className="p-0">
                      <div className="flex min-w-0 items-center gap-2">
                        {/* O Figma variava o tamanho das miniaturas dentro do mesmo recibo; todas seguem a dimensão compartilhada de 64 px. */}
                        <img
                          src={item.image}
                          alt=""
                          className="image-thumbnail rounded-sm"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">{item.name}</p>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            ID do token: <span className="text-primary">{item.tokenId}</span>
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className={`p-0 text-center text-xs text-muted-foreground ${index === 1 ? 'ps-1' : index === 2 ? 'pl-2' : ''}`}
                    >
                      (x {item.quantity})
                    </TableCell>
                    <TableCell
                      className={`p-0 text-right text-md font-semibold text-primary ${index === 0 ? 'pe-2' : index === 1 ? 'pe-1' : ''}`}
                    >
                      {(Number(item.price) * item.quantity).toFixed(2)} ETH
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-2 border-b border-border pb-2">
              <div className="grid grid-cols-[70%_30%] items-center">
                <p className="flex flex-col text-start text-foreground ms-35">
                  <span className="font-light">Taxa de rede</span>
                  <span className="font-medium">Total</span>
                </p>
                <p className="flex flex-col text-md text-end">
                  <span>0.016 ETH</span>
                  <span className="text-primary">26.846 ETH</span>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-2">
            <p className="text-xs leading-5 text-muted-foreground">
              Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira
              conectada e registrada na rede.
            </p>
            <Button
              render={<a href="https://etherscan.io/tx/0xA91F" target="_blank" rel="noreferrer" />}
              className="mt-5 mb-5 h-11 px-3 rounded-md"
            >
              Ver no Etherscan
            </Button>
          </div>
        </div>
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-2 bg-primary" />
    </Card>
  )
}

function ConfirmationDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col text-left text-xs text-muted-foreground">
      <p className="font-semibold">{label}</p>
      <p className="mt-0.5 font-normal">{value}</p>
    </div>
  )
}

function DetailDivider() {
  return <div className="h-6 w-[1px] shrink-0 bg-primary" aria-hidden="true" />
}
