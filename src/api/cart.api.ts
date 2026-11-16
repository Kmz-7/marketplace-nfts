import { apiClient } from '@/lib/api-client'
import type {
  CartContract,
  CartItemInputContract,
  CartQuoteContract,
  CartQuoteRequestContract,
} from '@/types/cart.contracts'

export async function getCart(signal?: AbortSignal) {
  const { data } = await apiClient.get<CartContract>('/cart', { signal })
  return data
}

export async function replaceCart(items: CartItemInputContract[]) {
  const { data } = await apiClient.put<CartContract>('/cart', { items })
  return data
}

export async function getCartQuote(request: CartQuoteRequestContract = {}, signal?: AbortSignal) {
  const { data } = await apiClient.post<CartQuoteContract>('/cart/quote', request, { signal })
  return data
}
