import { redirect } from '@tanstack/react-router'
import { getSession } from '@/api/auth.api'

export async function requireAuthentication(returnTo: string) {
  const session = await getSession()
  if (!session.authenticated) {
    throw redirect({ to: '/login', search: { returnTo } })
  }
}
