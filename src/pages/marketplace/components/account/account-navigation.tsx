import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  HeartIcon,
  LogOutIcon,
  ShoppingCartIcon,
  UserRoundIcon,
  WalletIcon,
} from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuthActions } from '@/hooks/use-auth'

const accountLinks = [
  { label: 'Dados do perfil', href: '/profile', icon: UserRoundIcon },
  { label: 'Carteiras', href: '/wallets', icon: WalletIcon },
  { label: 'Atividade', href: '#', icon: ShoppingCartIcon },
  { label: 'Lista de interesse', href: '#', icon: HeartIcon },
  { label: 'Sair', href: '/', icon: LogOutIcon },
]

export function AccountNavigation({ wallets }: { wallets: boolean }) {
  const navigate = useNavigate()
  const { logout, isPending } = useAuthActions()

  async function handleLogout() {
    try {
      await logout()
      await navigate({ to: '/' })
    } catch {
      toast.error('Não foi possível encerrar sua sessão. Tente novamente.')
    }
  }

  return (
    <Card className="h-fit gap-0 rounded-sm border-0 bg-card p-5 shadow-none ring-0">
      {/* O Figma variava o tamanho do título entre a navegação e o conteúdo de perfil; ambos usam lg. */}
      <h1 className="mb-5 text-lg font-semibold">Meu perfil</h1>
      <nav aria-label="Navegação do perfil" className="flex flex-wrap gap-3 md:flex-col md:gap-1">
        {accountLinks.map(({ label, href, icon: Icon }) => {
          const active = (wallets && href === '/wallets') || (!wallets && href === '/profile')
          return (
            <Button
              key={label}
              render={label === 'Sair' ? undefined : <a href={href} />}
              type={label === 'Sair' ? 'button' : undefined}
              disabled={label === 'Sair' && isPending}
              onClick={label === 'Sair' ? () => void handleLogout() : undefined}
              variant="ghost"
              aria-current={active ? 'page' : undefined}
              className={`h-10 justify-start gap-3 rounded-sm px-3 text-sm font-normal hover:bg-secondary ${active ? 'bg-secondary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon className="size-4" />
              {label === 'Sair' && isPending ? 'Saindo...' : label}
            </Button>
          )
        })}
      </nav>
    </Card>
  )
}
