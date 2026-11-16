import { lazy, Suspense, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from '@tanstack/react-router'
import { useSession } from '@/hooks/use-auth'
import { useAuthDialog } from '@/components/providers/auth-dialog-provider'
import {
  HeartIcon,
  HomeIcon,
  ScanLineIcon,
  ShoppingCartIcon,
  UserRoundIcon,
} from '@/components/ui/icons'

// O leitor (câmera + verificação) só é baixado quando o botão central é tocado.
const MobileScanDialog = lazy(() =>
  import('@/pages/home/components/mobile-scan-dialog').then((module) => ({ default: module.MobileScanDialog })),
)

export function MobileHomeNavigation() {
  const navigate = useNavigate()
  const session = useSession()
  const { openAuthDialog } = useAuthDialog()
  const [scanOpen, setScanOpen] = useState(false)

  return (
    <nav
      aria-label="Navegação mobile"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto flex h-24 max-w-lg items-center justify-between px-8 pt-4 text-muted-foreground drop-shadow-xl"
    >
      {/* Fundo com o recorte côncavo central exportado do Figma (Tab Bar / Vector). */}
      <img
        src="/assets/marketplace/mobile-tab-bar.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full"
      />
      <Button
        render={<a href="/" />}
        variant="ghost"
        size="icon"
        aria-label="Início"
        className="text-primary"
      >
        <HomeIcon variant="Bold" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Favoritos"
        onClick={() => {
          if (session.data?.authenticated) void navigate({ to: '/favorites' })
          else openAuthDialog()
        }}
      >
        <HeartIcon variant="Bold" />
      </Button>
      {/* Exceção à regra rounded-lg: o botão de scan é circular como no Figma (size="fab"). */}
      <span className="w-16 shrink-0" aria-hidden="true" />
      <Button
        variant="gradient"
        size="fab"
        className="absolute -top-8 left-1/2 -translate-x-1/2"
        aria-label="Verificar NFT por QR code"
        aria-haspopup="dialog"
        onClick={() => setScanOpen(true)}
      >
        <ScanLineIcon />
      </Button>
      {scanOpen && (
        <Suspense fallback={null}>
          <MobileScanDialog open onOpenChange={setScanOpen} />
        </Suspense>
      )}
      <Button render={<a href="/cart" />} variant="ghost" size="icon" aria-label="Carrinho">
        <ShoppingCartIcon variant="Bold" />
      </Button>
      {session.data?.authenticated ? (
        <Button render={<Link to="/profile" />} variant="ghost" size="icon" aria-label="Perfil">
          <UserRoundIcon variant="Bold" />
        </Button>
      ) : (
        <Button type="button" variant="ghost" size="icon" aria-label="Entrar" onClick={() => openAuthDialog()}>
          <UserRoundIcon variant="Bold" />
        </Button>
      )}
    </nav>
  )
}
