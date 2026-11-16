import { MobileHomeCatalog } from '@/pages/home/components/mobile-home-catalog'
import { MobileHomeHero } from '@/pages/home/components/mobile-home-hero'
import { MobileHomeNavigation } from '@/pages/home/components/mobile-home-navigation'
import { MobileHomeToolbar } from '@/pages/home/components/mobile-home-toolbar'
import type { HomeNft } from '@/pages/home/components/home-nft-mapper'

export function MobileHome({ nfts, loading }: { nfts: HomeNft[]; loading: boolean }) {
  return (
    <main className="pb-28 pt-8 md:hidden">
      <MobileHomeToolbar />
      <MobileHomeHero />
      <MobileHomeCatalog nfts={nfts} loading={loading} />
      <MobileHomeNavigation />
    </main>
  )
}
