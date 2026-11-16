import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getCart, replaceCart } from '@/api/cart.api'
import { useSession } from '@/hooks/use-auth'
import type { CartContract, CartLineContract } from '@/types/cart.contracts'

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
  availableQuantity?: number
  available?: boolean
}

export type CartEntry = MarketplaceNft & { quantity: number; lineId: string }

type MarketplaceState = {
  cart: CartEntry[]
  favorites: MarketplaceNft[]
}

type MarketplaceStateContextValue = MarketplaceState & {
  isFavorite: (id: string) => boolean
  addToCart: (item: MarketplaceNft, quantity?: number) => Promise<boolean>
  changeCartQuantity: (id: string, amount: number) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  addFavorite: (item: MarketplaceNft) => boolean
  removeFavorite: (id: string) => void
}

const MarketplaceStateContext = createContext<MarketplaceStateContextValue | null>(null)
const EMPTY_STATE: MarketplaceState = { cart: [], favorites: [] }
const STORAGE_PREFIX = 'kurio.marketplace-state.v1.'

function lineIdFor(item: Pick<MarketplaceNft, 'id' | 'edition'>) {
  return `${item.id}::${item.edition}`
}

function readState(userId: string): MarketplaceState {
  try {
    const value = localStorage.getItem(`${STORAGE_PREFIX}${userId}`)
    if (!value) return EMPTY_STATE
    const parsed = JSON.parse(value) as Partial<MarketplaceState>
    return {
      cart: Array.isArray(parsed.cart)
        ? parsed.cart.map((item) => ({
            ...item,
            lineId: typeof item.lineId === 'string' ? item.lineId : lineIdFor(item),
          }))
        : [],
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

function toCartContractItems(cart: CartEntry[]) {
  return cart.map((item) => ({ nftId: item.id, editionId: item.edition, quantity: item.quantity }))
}

function fromCartContractLine(item: CartLineContract): CartEntry {
  return {
    id: item.nftId,
    lineId: item.id,
    tokenId: item.tokenId,
    name: item.name,
    creator: item.creator,
    image: item.imageUrl,
    price: item.unitPriceEth,
    edition: item.editionId,
    collection: item.collection,
    availableQuantity: item.availableQuantity,
    available: item.available,
    quantity: item.quantity,
  }
}

function fromCartContract(cart: CartContract) {
  return cart.items.map(fromCartContractLine)
}

export function MarketplaceStateProvider({ children }: { children: ReactNode }) {
  const session = useSession()
  const authenticated = Boolean(session.data?.authenticated && session.data.user)
  const userId = authenticated && session.data?.user ? session.data.user.id : 'guest'
  const [states, setStates] = useState<Record<string, MarketplaceState>>({})
  const statesRef = useRef(states)
  const cartMutationQueue = useRef<Record<string, Promise<void>>>({})
  const state = states[userId] ?? readState(userId)

  useEffect(() => {
    if (!authenticated || userId === 'guest') return
    const guest = statesRef.current.guest ?? readState('guest')
    if (!guest.cart.length) return
    const account = statesRef.current[userId] ?? readState(userId)
    const cartById = new Map(account.cart.map((item) => [item.lineId, item]))
    for (const item of guest.cart) {
      const existing = cartById.get(item.lineId)
      cartById.set(item.lineId, {
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

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const remoteCart = await getCart()
        if (cancelled) return
        const current = statesRef.current[userId] ?? readState(userId)
        // A resposta REST é a fonte de verdade; não restaura uma cópia local obsoleta após reset ou remoção.
        const cartItems = fromCartContract(remoteCart)
        if (cancelled) return
        const next = { ...current, cart: cartItems }
        statesRef.current = { ...statesRef.current, [userId]: next }
        writeState(userId, next)
        setStates((currentStates) => ({ ...currentStates, [userId]: next }))
      } catch {
        // A local-only preview keeps its persisted cart when the REST mock is disabled.
      }
    })()
    return () => {
      cancelled = true
    }
  }, [userId])

  const updateState = useCallback(
    (update: (current: MarketplaceState) => MarketplaceState) => {
      // Persistência fora do updater evita duplicar operações quando o StrictMode repete o updater em desenvolvimento.
      const current = statesRef.current[userId] ?? readState(userId)
      const next = update(current)
      statesRef.current = { ...statesRef.current, [userId]: next }
      writeState(userId, next)
      setStates((currentStates) => ({ ...currentStates, [userId]: next }))
    },
    [userId],
  )

  const enqueueCartMutation = useCallback(
    <T,>(operation: () => Promise<T>) => {
      const previous = cartMutationQueue.current[userId] ?? Promise.resolve()
      const next = previous.catch(() => undefined).then(operation)
      cartMutationQueue.current[userId] = next.then(
        () => undefined,
        () => undefined,
      )
      return next
    },
    [userId],
  )

  const addToCart = useCallback(
    (item: MarketplaceNft, quantity = 1) =>
      enqueueCartMutation(async () => {
        const current = statesRef.current[userId] ?? readState(userId)
        const lineId = lineIdFor(item)
        if (current.cart.some((entry) => entry.lineId === lineId)) return false
        const nextCart = [...current.cart, { ...item, lineId, quantity: Math.max(1, quantity) }]
        const remoteCart = await replaceCart(toCartContractItems(nextCart))
        updateState((latest) => ({ ...latest, cart: fromCartContract(remoteCart) }))
        return true
      }),
    [enqueueCartMutation, updateState, userId],
  )

  const changeCartQuantity = useCallback(
    (lineId: string, amount: number) =>
      enqueueCartMutation(async () => {
        // O controle não chega a zero; a quantidade mínima é 1 e a lixeira remove o item.
        const current = statesRef.current[userId] ?? readState(userId)
        const nextCart = current.cart.map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: Math.max(1, item.quantity + amount) }
            : item,
        )
        const remoteCart = await replaceCart(toCartContractItems(nextCart))
        updateState((latest) => ({ ...latest, cart: fromCartContract(remoteCart) }))
      }),
    [enqueueCartMutation, updateState, userId],
  )

  const removeFromCart = useCallback(
    (lineId: string) =>
      enqueueCartMutation(async () => {
        const current = statesRef.current[userId] ?? readState(userId)
        const nextCart = current.cart.filter((item) => item.lineId !== lineId)
        const remoteCart = await replaceCart(toCartContractItems(nextCart))
        updateState((latest) => ({ ...latest, cart: fromCartContract(remoteCart) }))
      }),
    [enqueueCartMutation, updateState, userId],
  )

  const clearCart = useCallback(async () => {
    return enqueueCartMutation(async () => {
      const remoteCart = await replaceCart([])
      updateState((current) => ({ ...current, cart: fromCartContract(remoteCart) }))
    })
  }, [enqueueCartMutation, updateState])

  const refreshCart = useCallback(async () => {
    const remoteCart = await getCart()
    updateState((current) => ({ ...current, cart: fromCartContract(remoteCart) }))
  }, [updateState])

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
    clearCart,
    refreshCart,
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
