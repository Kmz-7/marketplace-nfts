import { HomeJournal } from '@/pages/home/components/home-journal'
import { HomeHero } from '@/pages/home/components/home-hero'
import { HomeCatalog } from '@/pages/home/components/home-catalog'
import { HomeHighlights } from '@/pages/home/components/home-highlights'
import type { HomeNft } from '@/pages/home/components/home-nft-mapper'

export function HomeDesktopContent({
  nfts,
  isPending,
  isError,
  currentPage,
  totalPages,
  visiblePages,
  activeTab,
  onTabChange,
  selectedCollection,
  selectedNetwork,
  onCollectionChange,
  onNetworkChange,
  onPriceApply,
  onPageChange,
}: {
  nfts: HomeNft[]
  isPending: boolean
  isError: boolean
  currentPage: number
  totalPages: number
  visiblePages: number[]
  activeTab: string
  onTabChange: (tab: string) => void
  selectedCollection: string
  selectedNetwork: string
  onCollectionChange: (collection: string) => void
  onNetworkChange: (network: string) => void
  onPriceApply: (range: number[]) => void
  onPageChange: (page: number) => void
}) {
  return (
    <main className="hidden flex-col gap-16 pb-16 md:flex lg:gap-24">
      <HomeHero />

      <HomeCatalog
        nfts={nfts}
        isPending={isPending}
        isError={isError}
        currentPage={currentPage}
        totalPages={totalPages}
        visiblePages={visiblePages}
        activeTab={activeTab}
        onTabChange={onTabChange}
        selectedCollection={selectedCollection}
        selectedNetwork={selectedNetwork}
        onCollectionChange={onCollectionChange}
        onNetworkChange={onNetworkChange}
        onPriceApply={onPriceApply}
        onPageChange={onPageChange}
      />

      <HomeHighlights />

      <HomeJournal />
    </main>
  )
}
