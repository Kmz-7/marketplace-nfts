import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AuthFormFields } from './auth-form-fields'
import { useAuthForm } from './use-auth-form'

export function AuthForm({ register, returnTo }: { register: boolean; returnTo?: string }) {
  const navigate = useNavigate()
  const authForm = useAuthForm(register, returnTo)

  return (
    <Card className="flex min-h-[85vh] w-full flex-col justify-center gap-0 rounded-none bg-transparent py-10 ring-0 md:min-h-0 md:rounded-lg md:p-8">
      <Button
        render={<a href="/" />}
        variant="ghost"
        className="h-auto p-0 text-lg font-bold tracking-[0.15em] hover:bg-transparent"
      >
        KURIO
      </Button>
      <h1 className="mt-16 text-center text-lg font-semibold md:mt-8">
        {register ? 'Criar perfil de colecionador' : 'Entrar'}
      </h1>
      <form noValidate className="mt-8 space-y-3" onSubmit={authForm.handleSubmit}>
        <AuthFormFields
          register={register}
          variant="auth"
          values={authForm.values}
          errors={authForm.errors}
          showPassword={authForm.showPassword}
          disabled={authForm.isPending}
          onFieldChange={authForm.updateField}
          onTogglePassword={authForm.togglePassword}
        />
        {authForm.formError && (
          <p role="alert" className="text-xs text-destructive">
            {authForm.formError}
          </p>
        )}
        {!register && (
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-xs text-primary"
            onClick={() =>
              toast.info('A recuperação de senha não está disponível nesta simulação.')
            }
          >
            Esqueceu a senha?
          </Button>
        )}
        <Button type="submit" className="mt-6 h-14 w-full" disabled={authForm.isPending}>
          {authForm.isPending ? 'Aguarde...' : register ? 'Criar perfil' : 'Entrar'}
        </Button>
      </form>
      <div className="mt-10 flex items-center gap-3 text-xs">
        <span className="h-px flex-1 bg-border" />
        Ou continue com
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="mt-4 grid gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={() => toast.info('O acesso com Google não está disponível nesta simulação.')}
        >
          Continuar com Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={() => toast.info('O acesso com Facebook não está disponível nesta simulação.')}
        >
          Continuar com Facebook
        </Button>
      </div>
      <p className="mt-10 text-center text-xs text-muted-foreground">
        {register ? 'Já tem uma conta?' : 'Novo na Kurio?'}{' '}
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-xs font-normal text-foreground"
          onClick={() =>
            void navigate({
              to: register ? '/login' : '/register',
              search: { returnTo },
            })
          }
        >
          {register ? 'Entre' : 'Crie uma conta'}
        </Button>
      </p>
    </Card>
  )
}
