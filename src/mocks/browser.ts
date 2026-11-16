import { setupWorker } from 'msw/browser'
import { setMockDomainLoader, type MockFeatureDomain } from '@/lib/mock-runtime'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

const loadedDomains = new Map<MockFeatureDomain, Promise<void>>()

async function loadDomain(domain: MockFeatureDomain) {
  const domainHandlers =
    domain === 'profile'
      ? (await import('./handlers/profile.handlers')).profileHandlers
      : (await import('./handlers/scan.handlers')).scanHandlers

  worker.use(...domainHandlers)
}

setMockDomainLoader((domain) => {
  const existingLoad = loadedDomains.get(domain)
  if (existingLoad) return existingLoad

  const pendingLoad = loadDomain(domain).catch((error: unknown) => {
    loadedDomains.delete(domain)
    throw error
  })
  loadedDomains.set(domain, pendingLoad)
  return pendingLoad
})
