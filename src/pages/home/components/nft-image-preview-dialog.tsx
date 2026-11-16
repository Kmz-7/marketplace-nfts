import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

export function NftImagePreviewDialog({
  name,
  image,
  onOpenChange,
}: {
  name: string
  image: string
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent closeLabel="Fechar" className="max-w-3xl border border-border bg-card p-5">
        <DialogTitle className="pr-8 text-lg">{name}</DialogTitle>
        <DialogDescription className="sr-only">
          Prévia ampliada da arte de {name}.
        </DialogDescription>
        <img
          src={image}
          alt={name}
          className="mx-auto max-h-[75dvh] w-full rounded-lg object-contain"
          decoding="async"
        />
      </DialogContent>
    </Dialog>
  )
}
