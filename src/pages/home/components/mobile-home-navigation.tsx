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

export function MobileHomeNavigation() {
  const navigate = useNavigate()
  const session = useSession()
  const { openAuthDialog } = useAuthDialog()

  return (
    <nav
      aria-label="Navegação mobile"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto flex h-20 max-w-lg items-center justify-around rounded-t-[28px] bg-secondary px-3 text-muted-foreground shadow-xl"
    >
      <Button
        render={<a href="/" />}
        variant="ghost"
        size="icon"
        aria-label="Início"
        className="text-primary"
      >
        <HomeIcon />
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
        <HeartIcon />
      </Button>
      <Button size="icon-lg" className="-mt-10 size-14 rounded-full" aria-label="Explorar">
        <ScanLineIcon />
      </Button>
      <Button render={<a href="/cart" />} variant="ghost" size="icon" aria-label="Carrinho">
        <ShoppingCartIcon />
      </Button>
      {session.data?.authenticated ? (
        <Button render={<Link to="/profile" />} variant="ghost" size="icon" aria-label="Perfil">
          <UserRoundIcon />
        </Button>
      ) : (
        <Button type="button" variant="ghost" size="icon" aria-label="Entrar" onClick={() => openAuthDialog()}>
          <UserRoundIcon />
        </Button>
      )}
    </nav>
  )
}
