import { createFileRoute } from '@tanstack/react-router'
import { NftPage } from '@/pages/marketplace/pages/nft-page'

export const Route = createFileRoute('/nft')({
  validateSearch: (search: Record<string, unknown>) => ({
    item: typeof search.item === 'string' ? search.item : undefined,
  }),
  component: NftPage,
})
