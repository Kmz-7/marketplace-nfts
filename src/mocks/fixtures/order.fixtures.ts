import type { OrderContract, OrderItemContract } from '@/types/order.contracts'

export function createOrderItemFixture(overrides: Partial<OrderItemContract> = {}): OrderItemContract {
  return {
    nftId: 'nft-emerald-842',
    editionId: 'edition-1-of-1',
    name: 'Emerald Ape #842',
    imageUrl: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?auto=format&fit=crop&w=640&q=80',
    unitPriceEth: '0.8500',
    quantity: 1,
    ...overrides,
  }
}

export function createOrderFixture(overrides: Partial<OrderContract> = {}): OrderContract {
  return {
    id: 'order-1001',
    userId: 'user-ada',
    status: 'confirmed',
    items: [createOrderItemFixture()],
    subtotalEth: '0.8500',
    discountEth: '0.0000',
    networkFeeEth: '0.0120',
    totalEth: '0.8620',
    transactionReference: '0xmock-a1b2c3d4',
    createdAt: '2026-11-14T12:00:00.000Z',
    updatedAt: '2026-11-14T12:00:08.000Z',
    ...overrides,
  }
}

export const orderFixtures: OrderContract[] = [
  createOrderFixture(),
  createOrderFixture({
    id: 'order-1002',
    userId: 'user-caio',
    status: 'pending',
    items: [createOrderItemFixture({ nftId: 'nft-cosmic-bloom-118', name: 'Cosmic Bloom #118', unitPriceEth: '1.2000' })],
    subtotalEth: '1.2000',
    networkFeeEth: '0.0150',
    totalEth: '1.2150',
    transactionReference: null,
    createdAt: '2026-11-14T12:10:00.000Z',
    updatedAt: '2026-11-14T12:10:00.000Z',
  }),
]
