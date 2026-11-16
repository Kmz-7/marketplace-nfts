import type { MarketplaceNft } from '@/components/providers/marketplace-state-provider'

export type PendingMarketplaceAction = {
  action: 'cart' | 'favorite'
  item: MarketplaceNft
}

const STORAGE_KEY = 'kurio.pending-marketplace-action.v1'

export function savePendingMarketplaceAction(action: PendingMarketplaceAction) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(action))
  } catch {
    // The login flow still works when browser storage is unavailable.
  }
}

export function clearPendingMarketplaceAction() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Closing the dialog should not interrupt navigation if browser storage is unavailable.
  }
}

export function consumePendingMarketplaceAction(): PendingMarketplaceAction | null {
  try {
    const serialized = sessionStorage.getItem(STORAGE_KEY)
    if (!serialized) return null
    sessionStorage.removeItem(STORAGE_KEY)
    const value = JSON.parse(serialized) as Partial<PendingMarketplaceAction>
    const item = value.item as Partial<MarketplaceNft> | undefined
    if (
      (value.action !== 'cart' && value.action !== 'favorite') ||
      !item ||
      typeof item.id !== 'string' ||
      typeof item.tokenId !== 'string' ||
      typeof item.name !== 'string' ||
      typeof item.creator !== 'string' ||
      typeof item.image !== 'string' ||
      typeof item.price !== 'string' ||
      typeof item.edition !== 'string'
    ) {
      return null
    }
    return { action: value.action, item: item as MarketplaceNft }
  } catch {
    return null
  }
}
