export interface NftContract {
  id: string
  name: string
  creator: string
  imageUrl: string
  priceEth: string
  previousPriceEth?: string
  edition: string
  collection: string
  network: string
  available: boolean
  featured: boolean
  imageOnly?: boolean
  createdAt: string
}

export interface NftListContract {
  items: NftContract[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface NftQueryParams {
  q?: string
  page?: number
  pageSize?: number
  sort?: 'recommended' | 'recent' | 'trending' | 'price-asc' | 'price-desc'
  collection?: string
  network?: string
  minPrice?: string
  maxPrice?: string
}

export interface NftUpdatedEvent {
  eventId: string
  version: number
  resource: 'nft'
  nft: NftContract
}
