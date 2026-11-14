import { createFileRoute } from '@tanstack/react-router'
import { NftPage } from '@/pages/marketplace/marketplace-pages'

export const Route = createFileRoute('/nft')({ component: NftPage })
