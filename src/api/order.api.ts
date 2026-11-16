import { apiClient } from '@/lib/api-client'
import type { CreateOrderRequestContract, OrderContract } from '@/types/order.contracts'

export async function createOrder(request: CreateOrderRequestContract, idempotencyKey: string) {
  const { data } = await apiClient.post<OrderContract>('/orders', request, {
    headers: { 'Idempotency-Key': idempotencyKey },
  })
  return data
}

export async function getOrder(orderId: string, signal?: AbortSignal) {
  const { data } = await apiClient.get<OrderContract>(`/orders/${orderId}`, { signal })
  return data
}
