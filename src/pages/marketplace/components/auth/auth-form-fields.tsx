import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { AuthField, AuthFieldErrors, AuthFormValues } from './auth-validation'

interface AuthFormFieldsProps {
  register: boolean
  variant: 'auth' | 'authDialog'
  values: AuthFormValues
  errors: AuthFieldErrors
  showPassword: boolean
  disabled: boolean
  onFieldChange: (field: AuthField, value: string) => void
  onTogglePassword: () => void
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-destructive">
      {message}
    </p>
  )
}

export function AuthFormFields({
  register,
  variant,
  values,
  errors,
  showPassword,
  disabled,
  onFieldChange,
  onTogglePassword,
}: AuthFormFieldsProps) {
  const passwordVariant = variant === 'authDialog' ? 'authDialogPassword' : 'auth'

  return (
    <>
      {register && (
        <div>
          <Input
            autoFocus
            aria-label="Nome de usuário"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'auth-name-error' : undefined}
            autoComplete="name"
            maxLength={60}
            placeholder="Nome de usuário"
            required
            disabled={disabled}
            value={values.name}
            variant={variant}
            onChange={(event) => onFieldChange('name', event.target.value)}
          />
          <FieldError id="auth-name-error" message={errors.name} />
        </div>
      )}
      <div>
        <Input
          autoFocus={!register}
          aria-label="E-mail"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'auth-email-error' : undefined}
          autoComplete="email"
          maxLength={254}
          placeholder="contato@email.com"
          required
          disabled={disabled}
          type="email"
          value={values.email}
          variant={variant}
          onChange={(event) => onFieldChange('email', event.target.value)}
        />
        <FieldError id="auth-email-error" message={errors.email} />
      </div>
      <div>
        <div className="relative">
          <Input
            aria-label="Senha"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'auth-password-error' : undefined}
            autoComplete={register ? 'new-password' : 'current-password'}
            className="pr-9"
            minLength={register ? 8 : undefined}
            maxLength={128}
            placeholder="Senha"
            required
            disabled={disabled}
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            variant={passwordVariant}
            onChange={(event) => onFieldChange('password', event.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={showPassword}
            className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 rounded-none p-0 text-muted-foreground hover:bg-transparent hover:text-primary"
            disabled={disabled}
            onClick={onTogglePassword}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
        <FieldError id="auth-password-error" message={errors.password} />
      </div>
      {register && (
        <div>
          <Input
            aria-label="Confirmar senha"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? 'auth-confirm-password-error' : undefined}
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            placeholder="Confirmar senha"
            required
            disabled={disabled}
            type={showPassword ? 'text' : 'password'}
            value={values.confirmPassword}
            variant={passwordVariant}
            onChange={(event) => onFieldChange('confirmPassword', event.target.value)}
          />
          <FieldError id="auth-confirm-password-error" message={errors.confirmPassword} />
        </div>
      )}
    </>
  )
}
