import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { StatusAlert } from '@/components/status-alert'
import { Button } from '@/components/ui/button'
import type { ProfileContract, ProfileUpdateContract } from '@/types/user.contracts'
import { ProfileField } from './profile-field'

const profileFieldNames: (keyof ProfileUpdateContract)[] = [
  'displayName',
  'username',
  'email',
  'ensName',
  'walletAlias',
]

function valuesFromProfile(profile: ProfileContract): ProfileUpdateContract {
  return {
    displayName: profile.displayName,
    username: profile.username,
    email: profile.email,
    ensName: profile.ensName,
    walletAlias: profile.walletAlias,
  }
}

export function ProfileForm({
  profile,
  isSaving,
  onSave,
}: {
  profile: ProfileContract
  isSaving: boolean
  onSave: (values: ProfileUpdateContract) => Promise<ProfileContract>
}) {
  const [values, setValues] = useState(() => valuesFromProfile(profile))
  const [hasError, setHasError] = useState(false)

  function updateField(name: keyof ProfileUpdateContract, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setHasError(false)
    try {
      await onSave(values)
      toast.success('Dados do perfil atualizados.')
    } catch {
      setHasError(true)
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      {hasError && (
        <StatusAlert tone="error" description="Não foi possível salvar o perfil. Revise os dados e tente novamente." />
      )}
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        {profileFieldNames.map((name) => (
          <ProfileField
            key={name}
            name={name}
            value={values[name]}
            disabled={isSaving}
            onChange={updateField}
          />
        ))}
      </div>
      <Button type="submit" width="mobile" className="h-10 min-w-36" disabled={isSaving}>
        {isSaving ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </form>
  )
}
