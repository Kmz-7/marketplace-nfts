import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { RealtimeProvider } from '@/components/providers/realtime-provider'
import { MarketplaceStateProvider } from '@/components/providers/marketplace-state-provider'
import { setMockWorkerReady } from '@/lib/mock-runtime'
import { routeTree } from './routeTree.gen'
import './styles.css'
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } } })
const router = createRouter({ routeTree, context: { queryClient } })
declare module '@tanstack/react-router' { interface Register { router: typeof router } }
if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
  // The mobile Home and detail show fixtures immediately; let their initial frame render before loading the larger mock client.
  const mobileStartupDelay = window.matchMedia('(max-width: 767px)').matches ? 700 : 0
  const afterFirstPaint = new Promise<void>((resolve) => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (mobileStartupDelay > 0) {
          window.setTimeout(resolve, mobileStartupDelay)
          return
        }

        const scheduleIdle = (
          window as Window & {
            requestIdleCallback?: (
              callback: () => void,
              options: { timeout: number },
            ) => number
          }
        ).requestIdleCallback

        if (scheduleIdle) scheduleIdle.call(window, resolve, { timeout: 1200 })
        else window.setTimeout(resolve, 120)
      }),
    )
  })
  setMockWorkerReady(
    afterFirstPaint.then(() =>
      import('./mocks/browser').then(({ worker }) =>
        worker.start({ onUnhandledRequest: 'bypass' }),
      ),
    ),
  )
}

// Mount immediately so static artwork and shell render while MSW registers; API requests wait for the worker.
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MarketplaceStateProvider>
        <RealtimeProvider>
          <TooltipProvider>
            <RouterProvider router={router} />
            {/* No mobile, o aviso cobria a barra de compra e a tab bar fixas na base; o deslocamento o mantém acima delas. */}
            <Toaster mobileOffset={{ bottom: '10.5rem' }} />
          </TooltipProvider>
        </RealtimeProvider>
      </MarketplaceStateProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
