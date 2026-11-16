import type { NftContract } from '@/types/nft.contracts'

export function toHomeNft(nft: NftContract) {
  return {
    id: nft.id,
    tokenId: `#${nft.id.match(/(\d+)$/)?.[1]?.padStart(4, '0') ?? nft.id}`,
    name: nft.name,
    creator: nft.creator,
    image: nft.imageUrl,
    price: nft.priceEth,
    previousPrice: nft.previousPriceEth,
    edition: nft.edition,
    rarityBadge: nft.rarityBadge,
    imageOnly: nft.imageOnly,
  }
}

export type HomeNft = ReturnType<typeof toHomeNft>
