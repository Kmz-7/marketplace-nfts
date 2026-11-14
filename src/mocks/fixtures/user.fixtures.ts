import type { UserContract } from '@/types/user.contracts'

export function createUserFixture(overrides: Partial<UserContract> = {}): UserContract {
  return {
    id: 'user-ada',
    name: 'Ada Collectora',
    email: 'ada@example.test',
    avatarUrl: 'https://i.pravatar.cc/160?img=47',
    createdAt: '2026-01-10T12:00:00.000Z',
    ...overrides,
  }
}

export const userFixtures: UserContract[] = [
  createUserFixture(),
  createUserFixture({
    id: 'user-caio',
    name: 'Caio Nakamoto',
    email: 'caio@example.test',
    avatarUrl: 'https://i.pravatar.cc/160?img=12',
    createdAt: '2026-02-18T09:30:00.000Z',
  }),
]

export const activeUserFixture = userFixtures[0]
