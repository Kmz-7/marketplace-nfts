import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusAlert } from '@/components/status-alert'
import { useSession, sessionQueryKey } from '@/hooks/use-auth'
import { getProfile, updateProfile, updateProfilePassword } from '@/api/profile.api'
import type { SessionContract } from '@/types/user.contracts'
import { PasswordChangeForm } from './password-change-form'
import { ProfileForm } from './profile-form'

function profileQueryKey(userId: string) {
  return ['profile', userId] as const
}

export function ProfileEditor() {
  const queryClient = useQueryClient()
  const session = useSession()
  const userId = session.data?.user?.id
  const profileQuery = useQuery({
    queryKey: profileQueryKey(userId ?? 'guest'),
    queryFn: ({ signal }) => getProfile(signal),
    enabled: Boolean(session.data?.authenticated && userId),
    retry: false,
  })
  const saveProfile = useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(profileQueryKey(profile.id), profile)
      queryClient.setQueryData<SessionContract>(sessionQueryKey, (current) =>
        current?.user?.id === profile.id
          ? {
              ...current,
              user: {
                ...current.user,
                name: profile.displayName,
                username: profile.username,
                email: profile.email,
                ensName: profile.ensName,
                walletAlias: profile.walletAlias,
              },
            }
          : current,
      )
    },
  })
  const changePassword = useMutation({ mutationFn: updateProfilePassword })

  return (
    <section aria-labelledby="collector-profile-title" className="space-y-8">
      <h2 id="collector-profile-title" className="text-lg font-semibold">
        Perfil do colecionador
      </h2>
      {profileQuery.isPending && (
        <div aria-label="Carregando perfil" aria-busy="true" className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      )}
      {profileQuery.isError && (
        <StatusAlert
          tone="error"
          description="Não foi possível carregar os dados da conta. Atualize a página e tente novamente."
        />
      )}
      {profileQuery.data && (
        <>
          <ProfileForm
            profile={profileQuery.data}
            isSaving={saveProfile.isPending}
            onSave={saveProfile.mutateAsync}
          />
          <PasswordChangeForm
            isSaving={changePassword.isPending}
            onSave={changePassword.mutateAsync}
          />
        </>
      )}
    </section>
  )
}
