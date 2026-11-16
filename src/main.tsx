import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { RealtimeProvider } from '@/components/providers/realtime-provider'
import { MarketplaceStateProvider } from '@/components/providers/marketplace-state-provider'
import { routeTree } from './routeTree.gen'
import './styles.css'
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } } })
const router = createRouter({ routeTree, context: { queryClient } })
declare module '@tanstack/react-router' { interface Register { router: typeof router } }
async function start() {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') { const { worker } = await import('./mocks/browser'); await worker.start({ onUnhandledRequest: 'bypass' }) }
  createRoot(document.getElementById('root')!).render(<React.StrictMode><QueryClientProvider client={queryClient}><MarketplaceStateProvider><RealtimeProvider><TooltipProvider><RouterProvider router={router} /><Toaster /></TooltipProvider></RealtimeProvider></MarketplaceStateProvider></QueryClientProvider></React.StrictMode>)
}
void start()
