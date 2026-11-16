import { nftFixtures } from '@/mocks/fixtures/nft.fixtures'
import { formatEth, parseEth } from '@/lib/eth'
import type { NftContract, NftUpdatedEvent } from '@/types/nft.contracts'

let nfts = copyFixtures()
let version = 0
export type MockNetworkScenario = 'normal' | 'slow' | 'offline' | 'server-error'
let networkScenario: MockNetworkScenario = 'normal'

function copyFixtures() {
  return nftFixtures.map((nft) => ({ ...nft }))
}

export function getNfts() {
  return nfts
}

export function getNft(id: string) {
  return nfts.find((nft) => nft.id === id)
}

export function updateNft(id: string, changes: Partial<Pick<NftContract, 'priceEth' | 'available'>>) {
  const index = nfts.findIndex((nft) => nft.id === id)
  if (index < 0) return undefined
  const current = nfts[index]
  const editionPricesEth =
    changes.priceEth && current.priceEth !== '0'
      ? Object.fromEntries(
          Object.entries(current.editionPricesEth ?? {}).map(([editionId, price]) => [
            editionId,
            formatEth((parseEth(price) * parseEth(changes.priceEth!)) / parseEth(current.priceEth)),
          ]),
        )
      : current.editionPricesEth
  nfts[index] = {
    ...current,
    ...changes,
    ...(editionPricesEth ? { editionPricesEth } : {}),
  }
  version += 1
  const event: NftUpdatedEvent = {
    eventId: `nft.updated:${id}:${version}`,
    version,
    resource: 'nft',
    nft: { ...nfts[index] },
  }
  return event
}

export function resetNftStore() {
  nfts = copyFixtures()
  networkScenario = 'normal'
}

export function getNetworkScenario() {
  return networkScenario
}

export function setNetworkScenario(scenario: MockNetworkScenario) {
  networkScenario = scenario
}
