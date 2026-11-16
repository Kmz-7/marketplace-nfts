import { Outlet, useRouterState } from '@tanstack/react-router'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

export function AppLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  if (pathname === '/confirmation') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 md:px-8 xl:px-0">
        <Outlet />
      </div>
      <div className="hidden md:block">
        <SiteFooter />
      </div>
    </div>
  )
}
