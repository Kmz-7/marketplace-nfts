import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSession, loginAccount, logoutAccount, registerAccount } from '@/api/auth.api'
import type { SessionContract } from '@/types/user.contracts'

export const sessionQueryKey = ['auth', 'session'] as const

const privateQueryKeys = [['orders'], ['profile'], ['wallets'], ['favorites']]

function replaceSession(queryClient: ReturnType<typeof useQueryClient>, session: SessionContract) {
  queryClient.setQueryData(sessionQueryKey, session)
}

function clearPrivateQueries(queryClient: ReturnType<typeof useQueryClient>) {
  for (const queryKey of privateQueryKeys) {
    queryClient.removeQueries({ queryKey })
  }
}

export function useSession() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: ({ signal }) => getSession(signal),
    staleTime: 30_000,
    retry: false,
    refetchInterval: (query) => (query.state.data?.authenticated ? 30_000 : false),
  })
}

export function useAuthActions() {
  const queryClient = useQueryClient()
  const loginMutation = useMutation({
    mutationFn: loginAccount,
    onSuccess: ({ user }) => {
      clearPrivateQueries(queryClient)
      replaceSession(queryClient, { authenticated: true, user })
    },
  })
  const registerMutation = useMutation({
    mutationFn: registerAccount,
    onSuccess: ({ user }) => {
      clearPrivateQueries(queryClient)
      replaceSession(queryClient, { authenticated: true, user })
    },
  })
  const logoutMutation = useMutation({
    mutationFn: logoutAccount,
    onSuccess: (session) => {
      clearPrivateQueries(queryClient)
      replaceSession(queryClient, session)
    },
  })

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isPending: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
  }
}
