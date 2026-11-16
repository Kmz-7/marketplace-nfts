import { createFileRoute } from '@tanstack/react-router'
import { NftPage } from '@/pages/marketplace/pages/nft-page'

export const Route = createFileRoute('/nft')({ component: NftPage })
