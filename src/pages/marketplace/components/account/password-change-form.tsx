import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { StatusAlert } from '@/components/status-alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label, RequiredMark } from '@/components/ui/label'
import type { PasswordUpdateContract } from '@/types/user.contracts'

type PasswordFormValues = PasswordUpdateContract & { confirmPassword: string }

const emptyValues: PasswordFormValues = { currentPassword: '', newPassword: '', confirmPassword: '' }

export function PasswordChangeForm({
  isSaving,
  onSave,
}: {
  isSaving: boolean
  onSave: (values: PasswordUpdateContract) => Promise<{ updated: boolean }>
}) {
  const [values, setValues] = useState(emptyValues)
  const [hasError, setHasError] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setHasError(false)
    if (values.newPassword.length < 8 || values.newPassword !== values.confirmPassword) {
      setHasError(true)
      return
    }
    try {
      await onSave({ currentPassword: values.currentPassword, newPassword: values.newPassword })
      setValues(emptyValues)
      toast.success('Senha alterada.')
    } catch {
      setHasError(true)
    }
  }

  return (
    <section aria-labelledby="change-password-title" className="max-w-2xl space-y-5">
      <h3 id="change-password-title" className="text-lg font-semibold">
        Alterar senha
      </h3>
      <form noValidate onSubmit={handleSubmit} className="space-y-5">
        {hasError && (
          <StatusAlert
            tone="error"
            description="Confira a senha atual, confirme a nova e use pelo menos 8 caracteres."
          />
        )}
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="current-password">
              Senha atual <RequiredMark />
            </Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              variant="account"
              required
              disabled={isSaving}
              value={values.currentPassword}
              onChange={(event) => setValues((current) => ({ ...current, currentPassword: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">
              Nova senha <RequiredMark />
            </Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              variant="account"
              minLength={8}
              required
              disabled={isSaving}
              value={values.newPassword}
              onChange={(event) => setValues((current) => ({ ...current, newPassword: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">
              Confirmar nova senha <RequiredMark />
            </Label>
            <Input
              id="confirm-new-password"
              type="password"
              autoComplete="new-password"
              variant="account"
              minLength={8}
              required
              disabled={isSaving}
              value={values.confirmPassword}
              onChange={(event) => setValues((current) => ({ ...current, confirmPassword: event.target.value }))}
            />
          </div>
        </div>
        <Button type="submit" width="mobile" className="h-10 min-w-36" disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Alterar senha'}
        </Button>
      </form>
    </section>
  )
}
