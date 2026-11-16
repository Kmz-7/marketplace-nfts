export interface AuthFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type AuthField = keyof AuthFormValues
export type AuthFieldErrors = Partial<Record<AuthField, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateAuthForm(register: boolean, values: AuthFormValues): AuthFieldErrors {
  const errors: AuthFieldErrors = {}
  if (register && (values.name.trim().length < 2 || values.name.trim().length > 60))
    errors.name = 'Informe um nome entre 2 e 60 caracteres.'
  if (values.email.trim().length > 254 || !emailPattern.test(values.email.trim()))
    errors.email = 'Informe um e-mail válido.'
  if (!values.password) errors.password = 'Informe sua senha.'
  else if (register && values.password.length < 8) errors.password = 'Use pelo menos 8 caracteres.'
  else if (values.password.length > 128) errors.password = 'Use até 128 caracteres.'
  if (register && values.password !== values.confirmPassword)
    errors.confirmPassword = 'As senhas não coincidem.'
  return errors
}
