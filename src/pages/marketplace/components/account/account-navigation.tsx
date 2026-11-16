import { Link, useNavigate } from '@tanstack/react-router'
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

export type AccountSection = 'profile' | 'wallets' | 'activity'

// "Atividade" é o histórico de compras (página em desenvolvimento); "Lista de interesse" abre os favoritos.
const accountLinks = [
  { label: 'Dados do perfil', href: '/profile', section: 'profile', icon: UserRoundIcon },
  { label: 'Carteiras', href: '/wallets', section: 'wallets', icon: WalletIcon },
  { label: 'Atividade', href: '/activity', section: 'activity', icon: ShoppingCartIcon },
  { label: 'Lista de interesse', href: '/favorites', icon: HeartIcon },
  { label: 'Sair', href: '/', icon: LogOutIcon },
] as const

export function AccountNavigation({
  section,
  variant = 'card',
}: {
  section: AccountSection
  /** `list`: lista centralizada em tela cheia do menu mobile do perfil. */
  variant?: 'card' | 'list'
}) {
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

  if (variant === 'list') {
    return (
      <nav aria-label="Navegação do perfil">
        <ul className="divide-y divide-border">
          {accountLinks.map((link) => {
            const { label, href, icon: Icon } = link
            const active = 'section' in link && link.section === section
            const isLogout = label === 'Sair'
            return (
              <li key={label}>
                <Button
                  render={isLogout ? undefined : <Link to={href} />}
                  type={isLogout ? 'button' : undefined}
                  disabled={isLogout && isPending}
                  onClick={isLogout ? () => void handleLogout() : undefined}
                  variant="ghost"
                  aria-current={active ? 'page' : undefined}
                  className={`h-14 w-full justify-center px-2 text-md font-normal hover:bg-card/60 ${active ? 'text-primary' : isLogout ? 'text-muted-foreground' : 'text-foreground'}`}
                >
                  {/* Bloco centralizado com a largura exata do rótulo mais longo ("Lista de interesse": 18 caracteres monoespaçados + ícone e gap):
                      ícones e primeiras letras ficam na mesma margem e o conjunto fica equidistante das laterais. */}
                  <span className="flex w-[calc(18ch+1.75rem)] items-center gap-3">
                    <Icon className="size-4" />
                    {isLogout && isPending ? 'Saindo...' : label}
                  </span>
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }

  return (
    <Card className="h-fit gap-0 rounded-sm border-0 bg-card p-5 shadow-none ring-0">
      {/* O Figma variava o tamanho do título entre a navegação e o conteúdo de perfil; ambos usam lg. */}
      <h1 className="mb-5 text-lg font-semibold">Meu perfil</h1>
      <nav aria-label="Navegação do perfil" className="flex flex-wrap gap-3 md:flex-col md:gap-1">
        {accountLinks.map((link) => {
          const { label, href, icon: Icon } = link
          const active = 'section' in link && link.section === section
          return (
            <Button
              key={label}
              render={label === 'Sair' ? undefined : <Link to={href} />}
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
