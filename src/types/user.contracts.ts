export interface UserContract {
  id: string
  name: string
  email: string
  avatarUrl: string
  createdAt: string
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
