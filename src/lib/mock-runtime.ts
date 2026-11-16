let mockWorkerReady: Promise<unknown> = Promise.resolve()
let mockDomainLoader: ((domain: MockFeatureDomain) => Promise<void>) | undefined

export type MockFeatureDomain = 'profile' | 'scan'

export function setMockWorkerReady(ready: Promise<unknown>) {
  mockWorkerReady = ready
}

export function waitForMockWorker() {
  return mockWorkerReady
}

export function setMockDomainLoader(loader: (domain: MockFeatureDomain) => Promise<void>) {
  mockDomainLoader = loader
}

export async function ensureMockDomain(domain: MockFeatureDomain) {
  if (import.meta.env.VITE_ENABLE_MOCKS !== 'true') return

  await waitForMockWorker()
  await mockDomainLoader?.(domain)
}
