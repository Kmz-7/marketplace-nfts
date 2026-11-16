export interface CartItemInputContract {
  nftId: string
  editionId: string
  quantity: number
}

export interface CartLineContract extends CartItemInputContract {
  id: string
  tokenId: string
  name: string
  creator: string
  collection: string
  imageUrl: string
  unitPriceEth: string
  availableQuantity: number
  available: boolean
}

export interface CartContract {
  items: CartLineContract[]
  version: number
}

export interface CartQuoteRequestContract {
  couponCode?: string
  network?: string
}

export interface CartQuoteContract {
  id: string
  cartVersion: number
  items: CartLineContract[]
  couponCode: string | null
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  expiresAt: string
}
