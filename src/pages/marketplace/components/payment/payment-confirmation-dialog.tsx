import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { CircleCheckIcon } from '@/components/ui/icons'

type PaymentConfirmationDialogProps = {
  open: boolean
  subtotal: number
  networkFee: number
  onOpenChange: (open: boolean) => void
}

export function PaymentConfirmationDialog({
  open,
  subtotal,
  networkFee,
  onOpenChange,
}: PaymentConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-background p-8 text-center">
        <DialogTitle className="sr-only">Compra confirmada</DialogTitle>
        <DialogDescription className="sr-only">
          Confirmação visual do pedido de NFTs.
        </DialogDescription>
        <CircleCheckIcon className="mx-auto size-14 text-primary" />
        <h2 className="mt-5 text-2xl font-semibold">Compra confirmada!</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Seu pedido foi confirmado. Você pode acompanhar os detalhes da compra na sua carteira.
        </p>
        <div className="mt-6 rounded-sm bg-card p-4 text-left text-sm">
          <p className="flex justify-between gap-4">
            <span className="text-muted-foreground">Itens</span>
            <span>3 NFTs</span>
          </p>
          <p className="mt-3 flex justify-between gap-4">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold text-primary">
              {(subtotal + networkFee).toFixed(3)} ETH
            </span>
          </p>
          <p className="mt-3 flex justify-between gap-4">
            <span className="text-muted-foreground">Status</span>
            <span className="text-primary">Confirmado</span>
          </p>
        </div>
        <Button render={<Link to="/" />} className="mt-6 h-11 w-full">
          Voltar ao mercado
        </Button>
      </DialogContent>
    </Dialog>
  )
}
