import { lazy, Suspense, useEffect } from 'react'
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SiteHeader } from './site-header'
import { showMarketplaceActionToast } from '@/components/marketplace-action-toast'
import { useMarketplaceState } from '@/components/providers/marketplace-state-provider'
import { useSession } from '@/hooks/use-auth'
import { consumePendingMarketplaceAction } from '@/lib/pending-marketplace-action'
import { AuthDialogProvider } from '@/components/providers/auth-dialog-provider'
import { useIsMobile } from '@/hooks/use-mobile'

const SiteFooter = lazy(() =>
  import('./site-footer').then((module) => ({ default: module.SiteFooter })),
)

export function AppLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const locationHref = useRouterState({ select: (state) => state.location.href })
  const isHomePage = pathname === '/'
  const isAuthRoute = pathname === '/login' || pathname === '/register'
  const isMobileFrameRoute = isAuthRoute || ['/cart', '/payment', '/nft'].includes(pathname)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const session = useSession()
  const marketplace = useMarketplaceState()
  const isMobile = useIsMobile()
  const { addFavorite, addToCart } = marketplace

  useEffect(() => {
    if (session.data?.expired && ['/payment', '/profile', '/wallets', '/favorites'].includes(pathname)) {
      for (const queryKey of [['orders'], ['profile'], ['wallets'], ['favorites']]) {
        queryClient.removeQueries({ queryKey })
      }
      void navigate({ to: '/login', search: { returnTo: locationHref } })
    }
  }, [locationHref, navigate, pathname, queryClient, session.data?.expired])

  useEffect(() => {
    if (!session.data?.authenticated) return
    const pendingAction = consumePendingMarketplaceAction()
    if (!pendingAction) return

    void (async () => {
      try {
        if (pendingAction.action === 'cart') {
          const added = await addToCart(pendingAction.item)
          showMarketplaceActionToast(added ? 'cart-added' : 'cart-existing', () => {
            void navigate({ to: '/cart' })
          })
          return
        }

        const added = addFavorite(pendingAction.item)
        showMarketplaceActionToast(added ? 'favorite-added' : 'favorite-existing', () => {
          void navigate({ to: '/favorites' })
        })
      } catch {
        toast.error('Não foi possível retomar a ação. Tente novamente.')
      }
    })()
  }, [addFavorite, addToCart, navigate, session.data?.authenticated])

  if (pathname === '/confirmation') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
    )
  }

  return (
    <AuthDialogProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        {/* A Home já reserva o espaço inferior no layout próprio; as demais rotas recebem respiro antes do rodapé. */}
        {/* No Figma, Login e Cadastro ocupam a tela inteira no mobile e usam modal sobre a Home no desktop. */}
        <div
          className={`mx-auto flex w-full flex-1 flex-col ${isAuthRoute ? 'max-w-none px-0 pb-0 md:max-w-[1200px] md:px-8 md:pb-24 xl:px-0' : `max-w-[1200px] px-4 md:px-8 xl:px-0 ${isMobileFrameRoute ? 'pb-0 md:pb-24' : isHomePage ? '' : 'pb-16 md:pb-24'}`}`}
        >
          <Outlet />
        </div>
        {!isMobile && (
          <Suspense fallback={null}>
            <div className="hidden md:block">
              <SiteFooter />
            </div>
          </Suspense>
        )}
      </div>
    </AuthDialogProvider>
  )
}
