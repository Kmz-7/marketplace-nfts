export type OrderStatus = 'pending' | 'confirmed' | 'declined'

export interface OrderItemContract {
  nftId: string
  editionId: string
  name: string
  imageUrl: string
  unitPriceEth: string
  quantity: number
}

export interface CreateOrderRequestContract {
  quoteId: string
  wallet: 'metamask' | 'walletconnect' | 'coinbase'
  network: 'ethereum' | 'polygon' | 'solana'
}

export interface OrderContract {
  id: string
  userId: string
  status: OrderStatus
  wallet: 'MetaMask' | 'WalletConnect' | 'Coinbase Wallet'
  network: 'Ethereum' | 'Polygon' | 'Solana'
  items: OrderItemContract[]
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  transactionReference: string | null
  createdAt: string
  updatedAt: string
}

export interface OrderUpdatedEventContract {
  eventId: string
  version: number
  resource: 'order'
  order: OrderContract
}
