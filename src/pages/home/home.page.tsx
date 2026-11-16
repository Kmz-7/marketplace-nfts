import { lazy, Suspense, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getNfts } from '@/api/nft.api'
import { toHomeNft } from './components/home-nft-mapper'
import { MobileHome } from './components/mobile-home'
import { useIsMobile } from '@/hooks/use-mobile'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { nftFixtures } from '@/mocks/fixtures/nft.fixtures'
import type { NftListContract } from '@/types/nft.contracts'

const HomeDesktopContent = lazy(() =>
  import('./components/home-desktop-content').then((module) => ({
    default: module.HomeDesktopContent,
  })),
)

const initialCatalogPreview: NftListContract = {
  items: [...nftFixtures].sort((a, b) => Number(a.priceEth) - Number(b.priceEth)),
  total: nftFixtures.length,
  page: 1,
  pageSize: 24,
  totalPages: 1,
}
export function HomePage() {
  const isMobile = useIsMobile()
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [priceRange, setPriceRange] = useState<number[] | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const search = useDebouncedValue(searchTerm.trim(), 300)
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
    // Busca o conjunto pequeno de catálogo para compor o mobile como no frame do Figma; a página desktop continua em blocos de nove.
    page: 1,
    pageSize: 24,
    q: search || undefined,
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
  const hasCatalogFilters = Boolean(search || selectedCollection || selectedNetwork || priceRange)
  const { data, isPending, isError } = useQuery({
    queryKey: ['nfts', query],
    queryFn: ({ signal }) => getNfts(query, signal),
    // O catálogo de demonstração aparece no primeiro paint; a resposta REST/MSW substitui este preview assim que chega.
    placeholderData: activeTab === 'all' && !hasCatalogFilters ? initialCatalogPreview : undefined,
  })
  const allNfts = (data?.items ?? []).map(toHomeNft)
  const nfts = allNfts.slice((currentPage - 1) * 9, currentPage * 9)
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 9))
  const visiblePages =
    currentPage <= 3
      ? Array.from({ length: Math.min(totalPages, 4) }, (_, index) => index + 1)
      : [1, currentPage, currentPage + 1, currentPage + 2].filter((page) => page <= totalPages)

  // Os frames Mobile e desktop têm composições próprias; renderizar só a variante ativa evita montar o catálogo oculto no celular.
  if (isMobile)
    return (
      <MobileHome
        nfts={allNfts}
        total={data?.total ?? 0}
        loading={isPending}
        isError={isError}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        curated={activeTab === 'all' && !hasCatalogFilters}
        filters={{
          selectedCollection,
          selectedNetwork,
          priceRange,
          onCollectionChange: setSelectedCollection,
          onNetworkChange: setSelectedNetwork,
          onPriceApply: setPriceRange,
        }}
        onClearFilters={() => {
          setSearchTerm('')
          setSelectedCollection('')
          setSelectedNetwork('')
          setPriceRange(null)
        }}
      />
    )

  return (
    <Suspense fallback={null}>
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
    </Suspense>
  )
}
