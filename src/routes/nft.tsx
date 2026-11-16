import { createFileRoute } from '@tanstack/react-router'
import { NftPage } from '@/pages/marketplace/pages/nft-page'

export const Route = createFileRoute('/nft')({
  // The NFT artwork is the mobile LCP; keeping this route in the eager bundle scored better than an additional chunk.
  codeSplitGroupings: [],
  validateSearch: (search: Record<string, unknown>) => ({
    item: typeof search.item === 'string' ? search.item : undefined,
  }),
  component: NftPage,
})
