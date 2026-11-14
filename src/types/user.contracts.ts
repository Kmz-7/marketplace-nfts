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
}

export interface ApiErrorContract {
  code: string
  message: string
}
