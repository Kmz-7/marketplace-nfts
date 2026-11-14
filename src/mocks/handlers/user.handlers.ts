import { delay, http, HttpResponse } from 'msw'
import type { ApiErrorContract, SessionContract } from '@/types/user.contracts'
import { activeUserFixture, userFixtures } from '../fixtures/user.fixtures'

export const userHandlers = [
  http.get('/api/session', async () => {
    await delay(350)
    const body: SessionContract = { authenticated: true, user: activeUserFixture }
    return HttpResponse.json(body)
  }),

  http.get('/api/users/:userId', async ({ params }) => {
    await delay(350)
    const user = userFixtures.find((fixture) => fixture.id === params.userId)
    if (!user) {
      const error: ApiErrorContract = { code: 'USER_NOT_FOUND', message: 'Colecionador não encontrado.' }
      return HttpResponse.json(error, { status: 404 })
    }
    return HttpResponse.json(user)
  }),
]
