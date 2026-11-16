import type { UserContract } from '@/types/user.contracts'

export function createUserFixture(overrides: Partial<UserContract> = {}): UserContract {
  return {
    id: 'user-ada',
    name: 'Ada Collectora',
    email: 'ada@example.test',
    username: 'ada-collectora',
    ensName: 'ada.kurio.eth',
    walletAlias: 'Carteira principal',
    avatarUrl: 'https://i.pravatar.cc/160?img=47',
    createdAt: '2026-01-10T12:00:00.000Z',
    ...overrides,
  }
}

const reviewerNames = [
  'Lumi Ferreira',
  'Theo Lima',
  'Bia Nakamura',
  'Rafa Costa',
  'Luna Martins',
  'Niko Almeida',
  'Maya Oliveira',
  'Enzo Sato',
  'Iara Mendes',
  'Caio Mello',
  'Zoe Tanaka',
  'Leo Duarte',
  'Nina Campos',
  'Yuri Azevedo',
  'Lia Nakamura',
  'Noah Reis',
  'Eva Barros',
  'Tomás Kato',
  'Isa Rocha',
  'Kai Nunes',
]

const reviewerAvatars = [
  '/assets/marketplace/ape-sunglasses.webp',
  '/assets/marketplace/ape-explorer.webp',
  '/assets/marketplace/ape-cream-coat.webp',
  '/assets/marketplace/ape-headphones.webp',
]

// Vinte perfis fictícios alimentam as avaliações; Ada e Caio seguem como as contas de demonstração seed.
export const reviewerFixtures: UserContract[] = reviewerNames.map((name, index) => ({
  id: `reviewer-${String(index + 1).padStart(2, '0')}`,
  name,
  email: `colecionador${String(index + 1).padStart(2, '0')}@example.test`,
  avatarUrl: reviewerAvatars[index % reviewerAvatars.length],
  createdAt: new Date(Date.UTC(2026, 0, 5 + index)).toISOString(),
}))

export const userFixtures: UserContract[] = [
  createUserFixture(),
  createUserFixture({
    id: 'user-caio',
    name: 'Caio Nakamoto',
    email: 'caio@example.test',
    username: 'caio-nakamoto',
    ensName: 'caio.kurio.eth',
    walletAlias: 'Carteira Coinbase',
    avatarUrl: 'https://i.pravatar.cc/160?img=12',
    createdAt: '2026-02-18T09:30:00.000Z',
  }),
  ...reviewerFixtures,
]

export const activeUserFixture = userFixtures[0]
