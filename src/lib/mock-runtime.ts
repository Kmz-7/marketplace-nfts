let mockWorkerReady: Promise<unknown> = Promise.resolve()

export function setMockWorkerReady(ready: Promise<unknown>) {
  mockWorkerReady = ready
}

export function waitForMockWorker() {
  return mockWorkerReady
}
