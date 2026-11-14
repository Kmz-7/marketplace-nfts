export type OrderStatus = 'pending' | 'confirmed' | 'declined'

export interface OrderItemContract {
  nftId: string
  editionId: string
  name: string
  imageUrl: string
  unitPriceEth: string
  quantity: number
}

export interface OrderContract {
  id: string
  userId: string
  status: OrderStatus
  items: OrderItemContract[]
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  transactionReference: string | null
  createdAt: string
  updatedAt: string
}
