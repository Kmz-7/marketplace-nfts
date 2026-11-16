import { Link, useRouterState } from '@tanstack/react-router'
import { LogoutCurve, ShoppingCart } from 'iconsax-react'
import { UserRound } from 'lucide-react'
import { MenuIcon } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/use-auth'
import { useMarketplaceState } from '@/components/providers/marketplace-state-provider'
import { useAuthDialog } from '@/components/providers/auth-dialog-provider'
import { HeaderNftSearch } from '@/components/layout/header-nft-search'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export interface SiteHeaderProps {
  cartCount?: number
  isAuthenticated?: boolean
}

export function SiteHeader({ cartCount, isAuthenticated }: SiteHeaderProps) {
  const sessionQuery = useSession()
  const marketplace = useMarketplaceState()
  const { openAuthDialog } = useAuthDialog()
  const itemCount = cartCount ?? marketplace.cart.reduce((count, item) => count + item.quantity, 0)
  const signedIn = isAuthenticated ?? Boolean(sessionQuery.data?.authenticated)
  const path = useRouterState({ select: (state) => state.location.pathname })
  const hash = useRouterState({ select: (state) => state.location.hash })
  const homePage = path === '/' && hash !== 'catalogo'
  const marketPage =
    (path === '/' && hash === 'catalogo') || ['/nft', '/cart', '/payment'].includes(path)

  return (
    <header className="sticky top-0 z-40 hidden bg-background/70 backdrop-blur-md md:block">
      <div className="mx-auto flex min-h-14 w-full max-w-[1200px] border-b border-border items-center justify-between gap-4 px-4 md:px-8 xl:px-0">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu" />
            }
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(20rem,85vw)]">
            <SheetHeader>
              <SheetTitle>KURIO</SheetTitle>
              <SheetDescription>Navegação do marketplace</SheetDescription>
            </SheetHeader>
            <nav aria-label="Navegação principal mobile" className="flex flex-col gap-2 px-4">
              <SheetClose
                render={<Link to="/" className="rounded-md px-3 py-2 text-sm hover:bg-muted" />}
              >
                Início
              </SheetClose>
              <SheetClose
                render={
                  <a href="/#catalogo" className="rounded-md px-3 py-2 text-sm hover:bg-muted" />
                }
              >
                Mercado
              </SheetClose>
              <SheetClose render={<Link to="/creators" search={{ feature: undefined }} className="rounded-md px-3 py-2 text-sm hover:bg-muted" />}>Criadores</SheetClose>
              <SheetClose render={<Link to="/learn" search={{ article: undefined }} className="rounded-md px-3 py-2 text-sm hover:bg-muted" />}>Aprenda</SheetClose>
            </nav>
          </SheetContent>
        </Sheet>

        <Button
          render={<Link to="/" />}
          variant="ghost"
          className="h-auto shrink-0 p-0 text-xs font-bold tracking-[0.18em] text-foreground hover:bg-transparent"
        >
          KURIO
        </Button>

        <NavigationMenu aria-label="Navegação principal" className="hidden flex-none md:flex">
          <NavigationMenuList className="gap-7">
            <NavigationMenuItem>
              <NavigationMenuLink
                render={
                  <Link
                    to="/"
                    hash=""
                    activeOptions={{ exact: true, includeHash: true, includeSearch: false }}
                  />
                }
                data-section-active={homePage || undefined}
              >
                Início
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={
                  <Link
                    to="/"
                    hash="catalogo"
                    activeOptions={{ exact: true, includeHash: true, includeSearch: false }}
                  />
                }
                data-section-active={marketPage || undefined}
              >
                Mercado
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link to="/creators" search={{ feature: undefined }} />}
                data-section-active={path === '/creators' || undefined}
              >
                Criadores
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link to="/learn" search={{ article: undefined }} />}
                data-section-active={path === '/learn' || undefined}
              >
                Aprenda
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* No Figma, a busca e o carrinho tinham escalas diferentes; ações do cabeçalho usam ícones size-4. */}
          <HeaderNftSearch />
          <Button
            render={<a href="/cart" />}
            variant="ghost"
            size="icon"
            aria-label={`Carrinho, ${itemCount} itens`}
            className="relative"
          >
            <ShoppingCart className="size-4" color="currentColor" />
            {signedIn && itemCount > 0 && (
              <Badge className="absolute top-1 right-0 flex size-3.5 items-center justify-center rounded-full p-0 text-xs">
                <span className="scale-90">{itemCount}</span>
              </Badge>
            )}
          </Button>
          <Button
            render={signedIn ? <a href="/profile" /> : undefined}
            className="hidden h-10 gap-1 rounded-lg px-3 text-md sm:inline-flex"
            aria-label={signedIn ? 'Acessar perfil' : 'Entrar'}
            onClick={signedIn ? undefined : () => openAuthDialog()}
          >
            {/* O Figma repetia o ícone de entrar no estado autenticado; o perfil usa um ícone de usuário. */}
            {signedIn ? (
              <UserRound className="size-4" aria-hidden="true" />
            ) : (
              <LogoutCurve color="currentColor" className="-scale-x-100 size-4" />
            )}
            {signedIn ? 'Perfil' : 'Entrar'}
          </Button>
        </div>
      </div>
    </header>
  )
}
