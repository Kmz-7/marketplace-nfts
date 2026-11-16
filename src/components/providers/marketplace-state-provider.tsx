import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useSession } from '@/hooks/use-auth'

export type MarketplaceNft = {
  id: string
  tokenId: string
  name: string
  creator: string
  image: string
  price: string
  edition: string
  collection?: string
  rarityBadge?: string
}

export type CartEntry = MarketplaceNft & { quantity: number }

type MarketplaceState = {
  cart: CartEntry[]
  favorites: MarketplaceNft[]
}

type MarketplaceStateContextValue = MarketplaceState & {
  isFavorite: (id: string) => boolean
  addToCart: (item: MarketplaceNft, quantity?: number) => boolean
  changeCartQuantity: (id: string, amount: number) => void
  removeFromCart: (id: string) => void
  addFavorite: (item: MarketplaceNft) => boolean
  removeFavorite: (id: string) => void
}

const MarketplaceStateContext = createContext<MarketplaceStateContextValue | null>(null)
const EMPTY_STATE: MarketplaceState = { cart: [], favorites: [] }
const STORAGE_PREFIX = 'kurio.marketplace-state.v1.'

function readState(userId: string): MarketplaceState {
  try {
    const value = localStorage.getItem(`${STORAGE_PREFIX}${userId}`)
    if (!value) return EMPTY_STATE
    const parsed = JSON.parse(value) as Partial<MarketplaceState>
    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
    }
  } catch {
    return EMPTY_STATE
  }
}

function writeState(userId: string, value: MarketplaceState) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(value))
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}

export function MarketplaceStateProvider({ children }: { children: ReactNode }) {
  const session = useSession()
  const authenticated = Boolean(session.data?.authenticated && session.data.user)
  const userId = authenticated && session.data?.user ? session.data.user.id : 'guest'
  const [states, setStates] = useState<Record<string, MarketplaceState>>({})
  const statesRef = useRef(states)
  const state = states[userId] ?? readState(userId)

  useEffect(() => {
    if (!authenticated || userId === 'guest') return
    const guest = statesRef.current.guest ?? readState('guest')
    if (!guest.cart.length) return
    const account = statesRef.current[userId] ?? readState(userId)
    const cartById = new Map(account.cart.map((item) => [item.id, item]))
    for (const item of guest.cart) {
      const existing = cartById.get(item.id)
      cartById.set(item.id, {
        ...item,
        quantity: item.quantity + (existing?.quantity ?? 0),
      })
    }
    const nextAccount = { ...account, cart: [...cartById.values()] }
    const nextGuest = { ...guest, cart: [] }
    statesRef.current = { ...statesRef.current, [userId]: nextAccount, guest: nextGuest }
    writeState(userId, nextAccount)
    writeState('guest', nextGuest)
    setStates((currentStates) => ({ ...currentStates, [userId]: nextAccount, guest: nextGuest }))
  }, [authenticated, userId])

  const updateState = useCallback(
    (update: (current: MarketplaceState) => MarketplaceState) => {
      // Persistência fora do updater evita duplicar operações quando o StrictMode repete o updater em desenvolvimento.
      const current = statesRef.current[userId] ?? readState(userId)
      const next = update(current)
      statesRef.current = { ...statesRef.current, [userId]: next }
      writeState(userId, next)
      setStates((currentStates) => {
        return { ...currentStates, [userId]: next }
      })
    },
    [userId],
  )

  const addToCart = useCallback(
    (item: MarketplaceNft, quantity = 1) => {
      if (state.cart.some((entry) => entry.id === item.id)) return false
      updateState((current) => ({
        ...current,
        cart: [...current.cart, { ...item, quantity: Math.max(1, quantity) }],
      }))
      return true
    },
    [state.cart, updateState],
  )

  const changeCartQuantity = useCallback(
    (id: string, amount: number) => {
      // No Figma, o controle permitia chegar a zero pelo menos; a quantidade mínima é 1 e a lixeira remove o item.
      updateState((current) => ({
        ...current,
        cart: current.cart.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item,
        ),
      }))
    },
    [updateState],
  )

  const removeFromCart = useCallback(
    (id: string) => {
      updateState((current) => ({
        ...current,
        cart: current.cart.filter((item) => item.id !== id),
      }))
    },
    [updateState],
  )

  const addFavorite = useCallback(
    (item: MarketplaceNft) => {
      if (state.favorites.some((favorite) => favorite.id === item.id)) return false
      updateState((current) => ({ ...current, favorites: [...current.favorites, item] }))
      return true
    },
    [state.favorites, updateState],
  )

  const removeFavorite = useCallback(
    (id: string) => {
      updateState((current) => ({
        ...current,
        favorites: current.favorites.filter((favorite) => favorite.id !== id),
      }))
    },
    [updateState],
  )

  const value: MarketplaceStateContextValue = {
    ...state,
    isFavorite: (id) => state.favorites.some((favorite) => favorite.id === id),
    addToCart,
    changeCartQuantity,
    removeFromCart,
    addFavorite,
    removeFavorite,
  }

  return <MarketplaceStateContext.Provider value={value}>{children}</MarketplaceStateContext.Provider>
}

export function useMarketplaceState() {
  const context = useContext(MarketplaceStateContext)
  if (!context) throw new Error('useMarketplaceState must be used inside MarketplaceStateProvider')
  return context
}
