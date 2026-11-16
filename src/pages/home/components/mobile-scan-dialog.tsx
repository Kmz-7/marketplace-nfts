import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { CameraOff, Link2, ShieldCheck } from 'lucide-react'
import { getNft } from '@/api/nft.api'
import { resolveScanCode } from '@/api/scan.api'
import { StatusAlert, StatusAlertAction } from '@/components/status-alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useQrScanner, type QrScannerStatus } from '@/hooks/use-qr-scanner'
import type { ScanResolveContract } from '@/types/scan.contracts'
import type { ApiErrorContract } from '@/types/user.contracts'

const demoCertificateCode = 'kurio:nft:emerald-ape-042'

const cameraMessages: Record<Exclude<QrScannerStatus, 'scanning' | 'starting'>, string> = {
  unsupported: 'Este navegador não lê QR codes pela câmera. Digite ou cole o código abaixo.',
  denied: 'A câmera foi bloqueada. Libere o acesso nas configurações do navegador ou digite o código abaixo.',
  error: 'Não foi possível abrir a câmera. Digite ou cole o código abaixo.',
}

/** Botão central da tab bar: lê o QR do certificado de um NFT (ou um link compartilhado) e confirma a autenticidade na API. */
export function MobileScanDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient()
  const [manualCode, setManualCode] = useState('')
  const [attempt, setAttempt] = useState(0)
  const resolve = useMutation({
    mutationFn: (code: string) => resolveScanCode({ code }),
    onSuccess: (result) => queryClient.setQueryData(['nft', result.nft.id], result.nft),
  })

  function submitCode(code: string) {
    if (!code.trim() || resolve.isPending) return
    resolve.mutate(code.trim())
  }

  function scanAgain() {
    resolve.reset()
    setManualCode('')
    setAttempt((value) => value + 1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        variant="fullscreen"
        closeLabel="Fechar leitor"
        className="bg-background/90 px-7 pt-6 pb-10 backdrop-blur-md"
        overlayClassName="bg-background/40 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-md space-y-6">
          <header className="flex h-11 items-center justify-center px-11">
            <DialogTitle className="text-center text-xl font-bold">Verificar NFT</DialogTitle>
          </header>
          <DialogDescription className="text-center text-sm">
            Aponte a câmera para o QR do certificado da obra ou de um link compartilhado da Kurio.
          </DialogDescription>

          {resolve.data ? (
            <ScanResult result={resolve.data} onScanAgain={scanAgain} onNavigate={() => onOpenChange(false)} />
          ) : (
            <>
              <CameraViewport
                key={attempt}
                paused={resolve.isPending || resolve.isError}
                onDetect={submitCode}
              />
              {resolve.isError && (
                <StatusAlert
                  description={errorMessage(resolve.error)}
                  action={<StatusAlertAction onClick={scanAgain}>Tentar de novo</StatusAlertAction>}
                />
              )}
              <form
                className="space-y-3"
                onSubmit={(event: FormEvent) => {
                  event.preventDefault()
                  submitCode(manualCode)
                }}
              >
                <Label htmlFor="scan-code" className="text-sm font-bold">
                  Ou digite o código
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="scan-code"
                    variant="auth"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder={demoCertificateCode}
                    value={manualCode}
                    onChange={(event) => setManualCode(event.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="gradient"
                    className="h-12 px-5 text-sm"
                    disabled={!manualCode.trim() || resolve.isPending}
                  >
                    {resolve.isPending ? 'Verificando…' : 'Verificar'}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-xs text-link"
                  onClick={() => setManualCode(demoCertificateCode)}
                >
                  Usar código de demonstração
                </Button>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CameraViewport({ paused, onDetect }: { paused: boolean; onDetect: (value: string) => void }) {
  const { videoRef, status } = useQrScanner({ enabled: !paused, onDetect })
  const unavailable = status !== 'scanning' && status !== 'starting'

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-card surface-gradient shadow-lg">
      {!unavailable && (
        <video
          ref={videoRef}
          muted
          playsInline
          aria-label="Visualização da câmera"
          className="size-full object-cover"
        />
      )}
      {/* Moldura de mira: quatro cantos em primary sobre a imagem da câmera. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-10">
        <span className="absolute top-0 left-0 size-10 rounded-tl-2xl border-t-4 border-l-4 border-primary" />
        <span className="absolute top-0 right-0 size-10 rounded-tr-2xl border-t-4 border-r-4 border-primary" />
        <span className="absolute bottom-0 left-0 size-10 rounded-bl-2xl border-b-4 border-l-4 border-primary" />
        <span className="absolute right-0 bottom-0 size-10 rounded-br-2xl border-r-4 border-b-4 border-primary" />
      </span>
      {unavailable && (
        <div className="absolute inset-16 flex flex-col items-center justify-center gap-3 text-center">
          <CameraOff className="size-6 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">{cameraMessages[status as keyof typeof cameraMessages]}</p>
        </div>
      )}
      {status === 'starting' && (
        <p className="absolute inset-x-0 bottom-4 text-center text-xs text-muted-foreground" aria-live="polite">
          Abrindo a câmera…
        </p>
      )}
      {paused && status === 'scanning' && (
        <p className="absolute inset-x-0 bottom-4 text-center text-xs text-foreground" aria-live="polite">
          Código lido. Verificando…
        </p>
      )}
    </div>
  )
}

function ScanResult({
  result,
  onScanAgain,
  onNavigate,
}: {
  result: ScanResolveContract
  onScanAgain: () => void
  onNavigate: () => void
}) {
  const navigate = useNavigate()
  // O cache ['nft', id] recebe os eventos nft.updated do Socket.IO; preço e disponibilidade se atualizam ao vivo.
  const { data: nft = result.nft } = useQuery({
    queryKey: ['nft', result.nft.id],
    queryFn: ({ signal }) => getNft(result.nft.id, signal),
    initialData: result.nft,
  })

  return (
    <section aria-live="polite" className="space-y-4">
      <Card className="gap-0 rounded-3xl border border-primary/30 p-0 shadow-lg ring-0 surface-gradient">
        <CardContent className="space-y-4 p-4">
          <img src={nft.imageUrl} alt={nft.name} className="image-standard aspect-square w-full rounded-2xl" />
          {result.verified ? (
            <Badge className="h-7 gap-1.5 rounded-lg bg-primary/15 px-2.5 text-xs text-link">
              <ShieldCheck aria-hidden="true" /> Certificado autêntico
            </Badge>
          ) : (
            <Badge className="h-7 gap-1.5 rounded-lg bg-card px-2.5 text-xs text-muted-foreground">
              <Link2 aria-hidden="true" /> Link do catálogo · sem certificado
            </Badge>
          )}
          <div className="space-y-1">
            <h2 className="text-lg font-bold">{nft.name}</h2>
            <p className="text-sm text-muted-foreground">por {nft.creator}</p>
          </div>
          <dl className="space-y-2 text-sm">
            <ResultRow label="ID do token" value={result.tokenId} />
            <ResultRow label="Coleção" value={nft.collection} />
            <ResultRow label="Rede" value={nft.network} />
            <ResultRow label="Edição" value={nft.edition} />
            <ResultRow
              label="Preço atual"
              value={nft.available ? `${nft.priceEth} ETH` : 'Indisponível'}
              highlight
            />
          </dl>
        </CardContent>
      </Card>
      <div className="flex gap-3">
        <Button type="button" variant="surface" className="h-12 flex-1 text-sm" onClick={onScanAgain}>
          Ler outro
        </Button>
        <Button
          type="button"
          variant="gradient"
          className="h-12 flex-[2] text-sm"
          onClick={() => {
            onNavigate()
            void navigate({ to: '/nft', search: { item: nft.id } })
          }}
        >
          Ver NFT
        </Button>
      </div>
    </section>
  )
}

function ResultRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={highlight ? 'text-md font-bold text-link' : 'text-foreground'}>{value}</dd>
    </div>
  )
}

function errorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorContract>(error) && error.response?.data?.message) return error.response.data.message
  return 'Não foi possível verificar o código. Confira a conexão e tente novamente.'
}
