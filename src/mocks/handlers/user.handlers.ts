import { delay, http, HttpResponse } from 'msw'
import type {
  ApiErrorContract,
  AuthCredentialsContract,
  RegisterAccountContract,
  SessionContract,
} from '@/types/user.contracts'
import {
  clearMockSession,
  createMockAccount,
  createMockSession,
  expireMockSession,
  findMockAccount,
  getMockUsers,
  getMockSession,
  verifyMockPassword,
} from '../state/auth.store'

function readAccessToken(request: Request) {
  return request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null
}

function isValidEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function errorResponse(
  code: string,
  message: string,
  status: number,
  fieldErrors?: Record<string, string>,
) {
  const error: ApiErrorContract = { code, message, ...(fieldErrors ? { fieldErrors } : {}) }
  return HttpResponse.json(error, { status })
}

export const userHandlers = [
  http.post('/api/auth/register', async ({ request }) => {
    await delay(400)
    const body = (await request.json()) as Partial<RegisterAccountContract>
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const fieldErrors: Record<string, string> = {}

    if (name.length < 2 || name.length > 60)
      fieldErrors.name = 'Informe um nome entre 2 e 60 caracteres.'
    if (!isValidEmail(email)) fieldErrors.email = 'Informe um e-mail válido.'
    if (password.length < 8 || password.length > 128)
      fieldErrors.password = 'A senha deve ter entre 8 e 128 caracteres.'
    if (Object.keys(fieldErrors).length > 0) {
      return errorResponse('VALIDATION_ERROR', 'Revise os campos destacados.', 422, fieldErrors)
    }
    if (findMockAccount(email)) {
      return errorResponse(
        'EMAIL_ALREADY_REGISTERED',
        'Já existe uma conta cadastrada com este e-mail.',
        409,
        { email: 'Este e-mail já está cadastrado.' },
      )
    }

    const user = await createMockAccount(name, email, password)
    return HttpResponse.json(createMockSession(user), { status: 201 })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    await delay(350)
    const body = (await request.json()) as Partial<AuthCredentialsContract>
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const fieldErrors: Record<string, string> = {}

    if (!isValidEmail(email)) fieldErrors.email = 'Informe um e-mail válido.'
    if (!password) fieldErrors.password = 'Informe sua senha.'
    else if (password.length > 128) fieldErrors.password = 'Use até 128 caracteres.'
    if (Object.keys(fieldErrors).length > 0) {
      return errorResponse('VALIDATION_ERROR', 'Revise os campos destacados.', 422, fieldErrors)
    }

    const account = findMockAccount(email)
    if (!account || !(await verifyMockPassword(account, password))) {
      return errorResponse('INVALID_CREDENTIALS', 'E-mail ou senha incorretos.', 401)
    }
    return HttpResponse.json(createMockSession(account.user))
  }),

  http.get('/api/session', async ({ request }) => {
    await delay(150)
    const body: SessionContract = getMockSession(readAccessToken(request))
    return HttpResponse.json(body)
  }),

  http.post('/api/auth/logout', async () => {
    await delay(120)
    clearMockSession()
    return HttpResponse.json({ authenticated: false, user: null } satisfies SessionContract)
  }),

  http.post('/api/mock/session/expire', () => {
    const expired = expireMockSession()
    return HttpResponse.json({ expired })
  }),

  http.get('/api/users/:userId', async ({ params }) => {
    await delay(350)
    const user = getMockUsers().find((fixture) => fixture.id === params.userId)
    if (!user) {
      return errorResponse('USER_NOT_FOUND', 'Colecionador não encontrado.', 404)
    }
    return HttpResponse.json(user)
  }),
]
