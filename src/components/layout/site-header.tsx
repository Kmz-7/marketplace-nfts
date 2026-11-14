import { Link, useRouterState } from '@tanstack/react-router'
import { LogoutCurve, ShoppingCart } from 'iconsax-react'
import { MenuIcon, SearchIcon } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

export function SiteHeader({ cartCount = 0, isAuthenticated = false }: SiteHeaderProps) {
  const path = useRouterState({ select: (state) => state.location.pathname })
  const hash = useRouterState({ select: (state) => state.location.hash })
  const marketPage = (path === '/' && hash === 'catalogo') || ['/nft', '/carrinho', '/pagamento'].includes(path)

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
              <SheetClose render={<Link to="/" className="rounded-md px-3 py-2 text-sm hover:bg-muted" />}>
                Início
              </SheetClose>
              <SheetClose render={<a href="/#catalogo" className="rounded-md px-3 py-2 text-sm hover:bg-muted" />}>
                Mercado
              </SheetClose>
              <span className="px-3 py-2 text-sm text-muted-foreground" aria-disabled="true">Criadores</span>
              <span className="px-3 py-2 text-sm text-muted-foreground" aria-disabled="true">Aprenda</span>
            </nav>
          </SheetContent>
        </Sheet>

        <Button render={<Link to="/" />} variant="ghost" className="h-auto shrink-0 p-0 text-xs font-bold tracking-[0.18em] text-foreground hover:bg-transparent">
          KURIO
        </Button>

        <NavigationMenu aria-label="Navegação principal" className="hidden flex-none md:flex">
          <NavigationMenuList className="gap-7">
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link to="/" hash="" activeOptions={{ exact: true, includeHash: true, includeSearch: false }} />}
                data-section-active={!marketPage || undefined}
              >
                Início
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link to="/" hash="catalogo" activeOptions={{ exact: true, includeHash: true, includeSearch: false }} />}
                data-section-active={marketPage || undefined}
              >
                Mercado
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem><span className="text-base text-muted-foreground" aria-disabled="true">Criadores</span></NavigationMenuItem>
            <NavigationMenuItem><span className="text-base text-muted-foreground" aria-disabled="true">Aprenda</span></NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" aria-label="Buscar NFTs">
            <SearchIcon size={20} color="currentColor" />
          </Button>
          <Button render={<a href="/carrinho" />} variant="ghost" size="icon" aria-label={`Carrinho, ${cartCount} itens`} className="relative">
            <ShoppingCart size={20} color="currentColor" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full p-0 text-[10px]">
                {cartCount}
              </Badge>
            )}
          </Button>
          <Button render={<a href={isAuthenticated ? '/perfil' : '/entrar'} />} className="hidden h-10 gap-2 rounded-lg px-3 text-base sm:inline-flex" aria-label={isAuthenticated ? 'Acessar perfil' : 'Entrar'}>
            <LogoutCurve size={16} color="currentColor" className="-scale-x-100" />
            {isAuthenticated ? 'Perfil' : 'Entrar'}
          </Button>
        </div>
      </div>
    </header>
  )
}
