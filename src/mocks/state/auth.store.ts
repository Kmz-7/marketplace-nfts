import { AUTH_TOKEN_STORAGE_KEY } from '@/lib/auth-token'
import type { AuthResponseContract, SessionContract, UserContract } from '@/types/user.contracts'
import { reviewerFixtures, userFixtures } from '../fixtures/user.fixtures'

interface StoredAccount {
  user: UserContract
  salt: string
  passwordHash: string
}

interface StoredSession {
  accessToken: string
  userId: string
  expiresAt: string
}

const ACCOUNTS_KEY = 'kurio.mock.accounts.v1'
const SESSION_KEY = 'kurio.mock.session.v1'
const SESSION_DURATION_MS = 30 * 60 * 1000
const HASH_ITERATIONS = 120_000
const encoder = new TextEncoder()
const seedAccounts: StoredAccount[] = [
  {
    user: userFixtures[0],
    salt: 'kurio-demo-ada-v1',
    passwordHash: '436d1cc6909878314f779ec36dda35663c39f082a2fa28378c2030693a56569a',
  },
  {
    user: userFixtures[1],
    salt: 'kurio-demo-caio-v1',
    passwordHash: '8354149e54678e713f421b19e68fde6f17b57a044870f31139f14f3d859b701d',
  },
]

function readStorage(key: string) {
  try {
    return globalThis.localStorage?.getItem(key) ?? null
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    globalThis.localStorage?.setItem(key, value)
  } catch {
    return
  }
}

function removeStorage(key: string) {
  try {
    globalThis.localStorage?.removeItem(key)
  } catch {
    return
  }
}

function readAccounts(): StoredAccount[] {
  const stored = readStorage(ACCOUNTS_KEY)
  if (stored) {
    try {
      const parsed: unknown = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        const seedUsers = new Map(seedAccounts.map(({ user }) => [user.id, user]))
        return (parsed as StoredAccount[]).map((account) => {
          const seedUser = seedUsers.get(account.user.id)
          return {
            ...account,
            user: {
              ...seedUser,
              ...account.user,
              username:
                account.user.username ?? seedUser?.username ?? usernameFromName(account.user.name),
              ensName: account.user.ensName ?? seedUser?.ensName ?? '',
              walletAlias: account.user.walletAlias ?? seedUser?.walletAlias ?? '',
            },
          }
        })
      }
    } catch {
      removeStorage(ACCOUNTS_KEY)
    }
  }
  writeStorage(ACCOUNTS_KEY, JSON.stringify(seedAccounts))
  return seedAccounts
}

function readSession(): StoredSession | null {
  const stored = readStorage(SESSION_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as StoredSession
  } catch {
    removeStorage(SESSION_KEY)
    return null
  }
}

export async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(salt), iterations: HASH_ITERATIONS },
    key,
    256,
  )
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function createSalt() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

function usernameFromName(name: string) {
  return (
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('en-US')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'colecionador'
  )
}

function createToken() {
  return crypto.randomUUID()
}

function createSession(user: UserContract): AuthResponseContract {
  const session: StoredSession = {
    accessToken: createToken(),
    userId: user.id,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
  }
  writeStorage(SESSION_KEY, JSON.stringify(session))
  writeStorage(AUTH_TOKEN_STORAGE_KEY, session.accessToken)
  return { accessToken: session.accessToken, user, expiresAt: session.expiresAt }
}

export function findMockAccount(email: string) {
  const normalizedEmail = email.trim().toLocaleLowerCase('en-US')
  return readAccounts().find(
    (account) => account.user.email.toLocaleLowerCase('en-US') === normalizedEmail,
  )
}

export function getMockUsers() {
  const users = new Map(userFixtures.map((user) => [user.id, user]))
  for (const account of readAccounts()) users.set(account.user.id, account.user)
  for (const reviewer of reviewerFixtures) users.set(reviewer.id, reviewer)
  return [...users.values()]
}

export async function createMockAccount(name: string, email: string, password: string) {
  const salt = createSalt()
  const user: UserContract = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLocaleLowerCase('en-US'),
    avatarUrl: '',
    createdAt: new Date().toISOString(),
    username: usernameFromName(name),
    ensName: '',
    walletAlias: '',
  }
  const account: StoredAccount = { user, salt, passwordHash: await hashPassword(password, salt) }
  writeStorage(ACCOUNTS_KEY, JSON.stringify([...readAccounts(), account]))
  return user
}

export async function verifyMockPassword(account: StoredAccount, password: string) {
  const actualHash = await hashPassword(password, account.salt)
  let difference = actualHash.length ^ account.passwordHash.length
  for (
    let index = 0;
    index < Math.max(actualHash.length, account.passwordHash.length);
    index += 1
  ) {
    difference |=
      (actualHash.charCodeAt(index) || 0) ^ (account.passwordHash.charCodeAt(index) || 0)
  }
  return difference === 0
}

export function createMockSession(user: UserContract) {
  return createSession(user)
}

export function getMockSession(accessToken: string | null): SessionContract {
  const session = readSession()
  if (!accessToken || !session || accessToken !== session.accessToken) {
    return { authenticated: false, user: null }
  }
  if (Date.parse(session.expiresAt) <= Date.now()) {
    clearMockSession()
    return { authenticated: false, user: null, expired: true }
  }
  const account = readAccounts().find((candidate) => candidate.user.id === session.userId)
  if (!account) {
    clearMockSession()
    return { authenticated: false, user: null }
  }
  return { authenticated: true, user: account.user }
}

export function isMockEmailTaken(email: string, excludedUserId: string) {
  const normalizedEmail = email.trim().toLocaleLowerCase('en-US')
  return readAccounts().some(
    (account) =>
      account.user.id !== excludedUserId &&
      account.user.email.toLocaleLowerCase('en-US') === normalizedEmail,
  )
}

export function updateMockUserProfile(userId: string, profile: {
  name: string
  username: string
  email: string
  ensName: string
  walletAlias: string
}) {
  const accounts = readAccounts()
  const account = accounts.find((candidate) => candidate.user.id === userId)
  if (!account) return null

  account.user = { ...account.user, ...profile }
  writeStorage(ACCOUNTS_KEY, JSON.stringify(accounts))
  return account.user
}

export async function updateMockUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const accounts = readAccounts()
  const account = accounts.find((candidate) => candidate.user.id === userId)
  if (!account || !(await verifyMockPassword(account, currentPassword))) return false

  const salt = createSalt()
  account.salt = salt
  account.passwordHash = await hashPassword(newPassword, salt)
  writeStorage(ACCOUNTS_KEY, JSON.stringify(accounts))
  return true
}

export function clearMockSession() {
  removeStorage(SESSION_KEY)
  removeStorage(AUTH_TOKEN_STORAGE_KEY)
}

export function expireMockSession() {
  const session = readSession()
  if (!session) return false
  writeStorage(SESSION_KEY, JSON.stringify({ ...session, expiresAt: new Date(0).toISOString() }))
  return true
}

export function resetMockAuth() {
  writeStorage(ACCOUNTS_KEY, JSON.stringify(seedAccounts))
  clearMockSession()
}
