import { nftFixtures } from '@/mocks/fixtures/nft.fixtures'
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
  nfts[index] = { ...nfts[index], ...changes }
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
