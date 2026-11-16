import { useNavigate } from '@tanstack/react-router'
import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { useAuthActions } from '@/hooks/use-auth'
import type { ApiErrorContract } from '@/types/user.contracts'
import {
  validateAuthForm,
  type AuthField,
  type AuthFieldErrors,
  type AuthFormValues,
} from './auth-validation'

const emptyValues: AuthFormValues = { name: '', email: '', password: '', confirmPassword: '' }

function getRequestError(error: unknown) {
  if (axios.isAxiosError<ApiErrorContract>(error)) {
    return (
      error.response?.data ?? {
        code: 'REQUEST_FAILED',
        message: 'Não foi possível concluir a solicitação.',
      }
    )
  }
  return { code: 'REQUEST_FAILED', message: 'Não foi possível concluir a solicitação.' }
}

function safeReturnPath(path?: string) {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return '/'
  return path
}

export function useAuthForm(
  registerMode: boolean,
  returnTo?: string,
  onSuccess?: () => void,
) {
  const navigate = useNavigate()
  const actions = useAuthActions()
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState<AuthFieldErrors>({})
  const [formError, setFormError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function updateField(field: AuthField, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setFormError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    const validationErrors = validateAuthForm(registerMode, values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    try {
      if (registerMode) {
        await actions.register({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
        })
      } else {
        await actions.login({ email: values.email.trim().toLowerCase(), password: values.password })
      }
      if (onSuccess) onSuccess()
      else await navigate({ to: safeReturnPath(returnTo) })
    } catch (error) {
      const response = getRequestError(error)
      setFormError(response.message)
      setErrors((current) => ({ ...current, ...response.fieldErrors }))
    }
  }

  return {
    values,
    errors,
    formError,
    showPassword,
    isPending: actions.isPending,
    updateField,
    togglePassword: () => setShowPassword((visible) => !visible),
    handleSubmit,
  }
}
