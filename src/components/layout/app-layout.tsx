import { useEffect } from 'react'
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'
import { showMarketplaceActionToast } from '@/components/marketplace-action-toast'
import { useMarketplaceState } from '@/components/providers/marketplace-state-provider'
import { useSession } from '@/hooks/use-auth'
import { consumePendingMarketplaceAction } from '@/lib/pending-marketplace-action'
import { AuthDialogProvider } from '@/components/providers/auth-dialog-provider'

export function AppLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const locationHref = useRouterState({ select: (state) => state.location.href })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const session = useSession()
  const marketplace = useMarketplaceState()

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

    if (pendingAction.action === 'cart') {
      const added = marketplace.addToCart(pendingAction.item)
      showMarketplaceActionToast(added ? 'cart-added' : 'cart-existing', () => {
        void navigate({ to: '/cart' })
      })
      return
    }

    const added = marketplace.addFavorite(pendingAction.item)
    showMarketplaceActionToast(added ? 'favorite-added' : 'favorite-existing', () => {
      void navigate({ to: '/favorites' })
    })
  }, [marketplace.addFavorite, marketplace.addToCart, navigate, session.data?.authenticated])

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
        <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 md:px-8 xl:px-0">
          <Outlet />
        </div>
        <div className="hidden md:block">
          <SiteFooter />
        </div>
      </div>
    </AuthDialogProvider>
  )
}
