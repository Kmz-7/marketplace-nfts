import { Input } from '@/components/ui/input'
import { Label, RequiredMark } from '@/components/ui/label'
import type { ProfileUpdateContract } from '@/types/user.contracts'

type ProfileFieldName = keyof ProfileUpdateContract

const fieldDetails: Record<ProfileFieldName, { label: string; required: boolean; type: string }> = {
  displayName: { label: 'Nome de exibição', required: true, type: 'text' },
  username: { label: 'Nome de usuário', required: true, type: 'text' },
  email: { label: 'E-mail', required: true, type: 'email' },
  ensName: { label: 'Nome ENS', required: false, type: 'text' },
  walletAlias: { label: 'Apelido da carteira', required: false, type: 'text' },
}

export function ProfileField({
  name,
  value,
  disabled,
  onChange,
}: {
  name: ProfileFieldName
  value: string
  disabled?: boolean
  onChange: (name: ProfileFieldName, value: string) => void
}) {
  const field = fieldDetails[name]
  const id = `profile-${name}`

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {field.label}
        {field.required && <RequiredMark />}
      </Label>
      <Input
        id={id}
        name={name}
        type={field.type}
        variant="account"
        autoComplete={name === 'email' ? 'email' : name === 'displayName' ? 'name' : undefined}
        maxLength={name === 'displayName' ? 60 : name === 'username' ? 30 : undefined}
        required={field.required}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
      />
    </div>
  )
}
