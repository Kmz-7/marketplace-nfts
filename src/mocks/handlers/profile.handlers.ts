import { delay, http, HttpResponse } from 'msw'
import type {
  ApiErrorContract,
  PasswordUpdateContract,
  ProfileContract,
  ProfileUpdateContract,
} from '@/types/user.contracts'
import {
  getMockSession,
  isMockEmailTaken,
  updateMockUserPassword,
  updateMockUserProfile,
} from '@/mocks/state/auth.store'

function errorResponse(code: string, message: string, status: number, fieldErrors?: Record<string, string>) {
  const body: ApiErrorContract = { code, message, ...(fieldErrors ? { fieldErrors } : {}) }
  return HttpResponse.json(body, { status })
}

function readAccessToken(request: Request) {
  return request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null
}

function requireProfileSession(request: Request) {
  const session = getMockSession(readAccessToken(request))
  return session.authenticated ? session.user : null
}

function toProfile(user: NonNullable<ReturnType<typeof requireProfileSession>>): ProfileContract {
  return {
    id: user.id,
    displayName: user.name,
    username: user.username ?? 'colecionador',
    email: user.email,
    ensName: user.ensName ?? '',
    walletAlias: user.walletAlias ?? '',
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  }
}

function validEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const profileHandlers = [
  http.get('/api/profile', async ({ request }) => {
    await delay(300)
    const user = requireProfileSession(request)
    if (!user) return errorResponse('UNAUTHENTICATED', 'Entre para consultar seu perfil.', 401)
    return HttpResponse.json(toProfile(user))
  }),

  http.put('/api/profile', async ({ request }) => {
    await delay(350)
    const user = requireProfileSession(request)
    if (!user) return errorResponse('UNAUTHENTICATED', 'Entre para atualizar seu perfil.', 401)

    const body = (await request.json()) as Partial<ProfileUpdateContract>
    const profile: ProfileUpdateContract = {
      displayName: typeof body.displayName === 'string' ? body.displayName.trim() : '',
      username: typeof body.username === 'string' ? body.username.trim().toLocaleLowerCase('en-US') : '',
      email: typeof body.email === 'string' ? body.email.trim().toLocaleLowerCase('en-US') : '',
      ensName: typeof body.ensName === 'string' ? body.ensName.trim() : '',
      walletAlias: typeof body.walletAlias === 'string' ? body.walletAlias.trim() : '',
    }
    const fieldErrors: Record<string, string> = {}
    if (profile.displayName.length < 2 || profile.displayName.length > 60)
      fieldErrors.displayName = 'Informe um nome entre 2 e 60 caracteres.'
    if (!/^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$/.test(profile.username))
      fieldErrors.username = 'Use de 3 a 30 letras minúsculas, números, hífen ou sublinhado.'
    if (!validEmail(profile.email)) fieldErrors.email = 'Informe um e-mail válido.'
    if (profile.ensName.length > 100) fieldErrors.ensName = 'Use até 100 caracteres.'
    if (profile.walletAlias.length > 50) fieldErrors.walletAlias = 'Use até 50 caracteres.'
    if (Object.keys(fieldErrors).length)
      return errorResponse('VALIDATION_ERROR', 'Revise os campos destacados.', 422, fieldErrors)
    if (isMockEmailTaken(profile.email, user.id))
      return errorResponse('EMAIL_ALREADY_REGISTERED', 'Este e-mail já está em uso.', 409, {
        email: 'Este e-mail já está em uso.',
      })

    const updatedUser = updateMockUserProfile(user.id, {
      name: profile.displayName,
      username: profile.username,
      email: profile.email,
      ensName: profile.ensName,
      walletAlias: profile.walletAlias,
    })
    if (!updatedUser) return errorResponse('USER_NOT_FOUND', 'Colecionador não encontrado.', 404)
    return HttpResponse.json(toProfile(updatedUser))
  }),

  http.put('/api/profile/password', async ({ request }) => {
    await delay(350)
    const user = requireProfileSession(request)
    if (!user) return errorResponse('UNAUTHENTICATED', 'Entre para alterar sua senha.', 401)

    const body = (await request.json()) as Partial<PasswordUpdateContract>
    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : ''
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : ''
    if (newPassword.length < 8 || newPassword.length > 128) {
      return errorResponse('VALIDATION_ERROR', 'A nova senha deve ter entre 8 e 128 caracteres.', 422, {
        newPassword: 'A nova senha deve ter entre 8 e 128 caracteres.',
      })
    }
    if (!(await updateMockUserPassword(user.id, currentPassword, newPassword))) {
      return errorResponse('CURRENT_PASSWORD_INVALID', 'A senha atual está incorreta.', 422, {
        currentPassword: 'A senha atual está incorreta.',
      })
    }
    return HttpResponse.json({ updated: true })
  }),
]
