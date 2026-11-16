import type { NftContract } from '@/types/nft.contracts'

const images = [
  '/assets/marketplace/ape-sunglasses.png',
  '/assets/marketplace/ape-explorer.png',
  '/assets/marketplace/ape-cream-coat.png',
  '/assets/marketplace/ape-headphones.png',
]

const records = [
  ['emerald-ape-042', 'Emerald Ape #042', 'Nova Sato', '1.19', '1/50', 'Kurio Apes', true],
  ['sage-nomad-009', 'Sage Nomad #009', 'Mika Tanaka', '1.69', '1/1', 'Kurio Nomads', true, '1.99'],
  ['neon-vessel-552', 'Neon Vessel #552', 'Studio K', '1.99', '1/10', 'Neon Vessels', true, '2.29'],
  ['cosmo-bloom-118', 'Cosmo Bloom #118', 'Aya Mori', '1.29', '1/50', 'Cosmo Blooms', true],
  ['violet-nomad-314', 'Violet Nomad #314', 'Mika Tanaka', '1.39', '1/1', 'Kurio Nomads', true],
  ['ivory-baron-883', 'Ivory Baron #883', 'Nova Sato', '1.79', '1/10', 'Kurio Apes', true],
  ['golden-beat-287', 'Golden Beat #287', 'Studio K', '0.99', '1/50', 'Golden Beats', true],
  ['golden-hour-409', 'Golden Hour #409', 'Studio K', '0.89', 'ABERTA', 'Golden Beats', true],
  ['emerald-signal-160', 'Emerald Signal #160', 'Nova Sato', '0.89', '1/25', 'Kurio Apes', true],
  ['emerald-ape-043', 'Emerald Ape #043', 'Nova Sato', '1.24', '1/50', 'Kurio Apes', false],
  ['ivory-baron-088', 'Ivory Baron #088', 'Nova Sato', '1.79', '1/10', 'Kurio Apes', false],
  ['cosmic-orbit-221', 'Cosmic Orbit #221', 'Aya Mori', '0.75', '1/100', 'Cosmo Blooms', false],
  ['violet-nomad-315', 'Violet Nomad #315', 'Mika Tanaka', '1.42', '1/1', 'Kurio Nomads', false],
  ['headphone-ape-007', 'Headphone Ape #007', 'Studio K', '0.95', '1/25', 'Golden Beats', false],
  ['cream-ape-123', 'Cream Ape #123', 'Nova Sato', '2.10', '1/10', 'Kurio Apes', false],
  ['neon-vessel-553', 'Neon Vessel #553', 'Studio K', '1.89', '1/10', 'Neon Vessels', false],
  ['sage-nomad-010', 'Sage Nomad #010', 'Mika Tanaka', '1.72', '1/1', 'Kurio Nomads', false],
  ['cosmo-bloom-119', 'Cosmo Bloom #119', 'Aya Mori', '1.35', '1/50', 'Cosmo Blooms', false],
] as const

const editionMultipliers: Record<string, number> = {
  '1/1': 2.5,
  '1/10': 1.7,
  '1/50': 1,
  '1/25': 1.25,
  '1/100': 0.85,
  ABERTA: 0.6,
}

function createEditionPrices(basePrice: string, currentEdition: string) {
  const baseMultiplier = editionMultipliers[currentEdition] ?? 1

  return Object.fromEntries(
    Object.entries(editionMultipliers).map(([edition, multiplier]) => [
      edition,
      edition === currentEdition
        ? basePrice
        : ((Number(basePrice) * multiplier) / baseMultiplier).toFixed(2),
    ]),
  )
}

export const nftFixtures: NftContract[] = records.map((record, index) => ({
  id: record[0],
  name: record[1],
  creator: record[2],
  imageUrl: images[index % images.length],
  priceEth: record[3],
  // O mock backend publica preços demonstrativos por edição para que a seleção altere o valor exibido.
  editionPricesEth: createEditionPrices(record[3], record[4]),
  edition: record[4],
  collection: record[5],
  network: ['Ethereum', 'Polygon', 'Solana'][index % 3],
  available: true,
  featured: record[6],
  // Apenas Emerald Ape #042 recebe a insígnia; outras peças reaproveitam a arte de óculos sem repetir o selo.
  ...(record[0] === 'emerald-ape-042' ? { rarityBadge: 'RARO' } : {}),
  createdAt: new Date(Date.UTC(2026, 10, 15 - index)).toISOString(),
  ...(record[7] ? { previousPriceEth: record[7] } : {}),
}))
