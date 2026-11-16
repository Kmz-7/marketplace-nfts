import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getNfts } from '@/api/nft.api'
import { toHomeNft } from './components/home-nft-mapper'
import { MobileHome } from './components/mobile-home'
import { HomeDesktopContent } from './components/home-desktop-content'

export function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [priceRange, setPriceRange] = useState<number[] | null>(null)
  const collectionNames: Record<string, string> = {
    'digital-art': 'Kurio Apes',
    photography: 'Cosmo Blooms',
    music: 'Golden Beats',
    '3d-art': 'Neon Vessels',
    collectibles: 'Kurio Nomads',
    generative: 'Cosmo Blooms',
    games: 'Golden Beats',
    memberships: 'Kurio Nomads',
    utility: 'Neon Vessels',
  }
  const networkNames: Record<string, string> = {
    ethereum: 'Ethereum',
    polygon: 'Polygon',
    solana: 'Solana',
  }
  const query = {
    page: currentPage,
    pageSize: 9,
    sort:
      activeTab === 'trending'
        ? ('trending' as const)
        : activeTab === 'launches'
          ? ('recent' as const)
          : ('recommended' as const),
    collection: collectionNames[selectedCollection],
    network: networkNames[selectedNetwork],
    minPrice: priceRange?.[0].toFixed(2),
    maxPrice: priceRange?.[1].toFixed(2),
  }
  const { data, isPending, isError } = useQuery({
    queryKey: ['nfts', query],
    queryFn: ({ signal }) => getNfts(query, signal),
  })
  const nfts = (data?.items ?? []).map(toHomeNft)
  const totalPages = data?.totalPages ?? 1
  const visiblePages =
    currentPage <= 3
      ? Array.from({ length: Math.min(totalPages, 4) }, (_, index) => index + 1)
      : [1, currentPage, currentPage + 1, currentPage + 2].filter((page) => page <= totalPages)

  return (
    <>
      <MobileHome nfts={nfts} loading={isPending} />
      <HomeDesktopContent
        nfts={nfts}
        isPending={isPending}
        isError={isError}
        currentPage={currentPage}
        totalPages={totalPages}
        visiblePages={visiblePages}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab)
          setCurrentPage(1)
        }}
        selectedCollection={selectedCollection}
        selectedNetwork={selectedNetwork}
        onCollectionChange={(collection) => {
          setSelectedCollection(collection)
          setCurrentPage(1)
        }}
        onNetworkChange={(network) => {
          setSelectedNetwork(network)
          setCurrentPage(1)
        }}
        onPriceApply={(range) => {
          setPriceRange(range)
          setCurrentPage(1)
        }}
        onPageChange={setCurrentPage}
      />
    </>
  )
}
