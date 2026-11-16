export interface UserContract {
  id: string
  name: string
  email: string
  avatarUrl: string
  createdAt: string
  username?: string
  ensName?: string
  walletAlias?: string
}

export interface ProfileContract {
  id: string
  displayName: string
  username: string
  email: string
  ensName: string
  walletAlias: string
  avatarUrl: string
  createdAt: string
}

export type ProfileUpdateContract = Pick<
  ProfileContract,
  'displayName' | 'username' | 'email' | 'ensName' | 'walletAlias'
>

export interface PasswordUpdateContract {
  currentPassword: string
  newPassword: string
}

export interface SessionContract {
  authenticated: boolean
  user: UserContract | null
  expired?: boolean
}

export interface AuthCredentialsContract {
  email: string
  password: string
}

export interface RegisterAccountContract extends AuthCredentialsContract {
  name: string
}

export interface AuthResponseContract {
  accessToken: string
  user: UserContract
  expiresAt: string
}

export interface ApiErrorContract {
  code: string
  message: string
  fieldErrors?: Record<string, string>
}
