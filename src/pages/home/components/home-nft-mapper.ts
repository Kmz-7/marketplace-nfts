import type { NftContract } from '@/types/nft.contracts'

export function toHomeNft(nft: NftContract) {
  return {
    name: nft.name,
    creator: nft.network,
    image: nft.imageUrl,
    price: nft.priceEth,
    previousPrice: nft.previousPriceEth,
    imageOnly: nft.imageOnly,
  }
}

export type HomeNft = ReturnType<typeof toHomeNft>
