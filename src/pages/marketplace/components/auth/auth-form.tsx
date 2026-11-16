import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AuthFormFields } from './auth-form-fields'
import { useAuthForm } from './use-auth-form'

export function AuthForm({
  register,
  returnTo,
  onRegisterChange,
  onSuccess,
}: {
  register: boolean
  returnTo?: string
  onRegisterChange?: (register: boolean) => void
  onSuccess?: () => void
}) {
  const navigate = useNavigate()
  const authForm = useAuthForm(register, returnTo, onSuccess)

  return (
    <Card className="flex min-h-dvh w-full flex-col items-center justify-start gap-0 rounded-none border-0 bg-transparent px-7 pt-32 pb-6 shadow-none ring-0 md:min-h-0 md:justify-center md:rounded-lg md:p-8">
      <Button
        render={<a href="/" />}
        variant="ghost"
        className="brand-logo h-auto p-0 hover:bg-transparent"
      >
        KURIO
      </Button>
      {/* O Figma posiciona a marca no mesmo ponto nas duas telas mobile; a pilha usa espaçamento próprio em vez do modal desktop. */}
      <h1 className={`mt-24 text-center font-bold md:mt-8 ${register ? 'text-lg' : 'text-xl'}`}>
        {register ? 'Criar perfil de colecionador' : 'Entrar'}
      </h1>
      <form noValidate className="mt-8 w-full space-y-3" onSubmit={authForm.handleSubmit}>
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
          // No Figma, o link de recuperação fica alinhado à direita, sob o campo de senha.
          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-sm font-normal text-link"
              onClick={() =>
                toast.info('A recuperação de senha não está disponível nesta simulação.')
              }
            >
              Esqueceu a senha?
            </Button>
          </div>
        )}
        <Button type="submit" size="cta" className="mt-7" disabled={authForm.isPending}>
          {authForm.isPending ? 'Aguarde...' : register ? 'Criar perfil' : 'Entrar'}
        </Button>
      </form>
      <div className="mt-10 flex w-full items-center gap-3 text-sm">
        <span className="h-px flex-1 bg-border" />
        Ou continue com
        <span className="h-px flex-1 bg-border" />
      </div>
      {/* Marcas Google e Facebook exportadas do Figma: não há ícones equivalentes no Lucide nem no iconsax. */}
      <div className="mt-3 grid w-full gap-4">
        <Button
          type="button"
          variant="outline"
          className="h-10 gap-3 border-checkout-border bg-transparent text-sm text-muted-foreground dark:bg-transparent"
          onClick={() => toast.info('O acesso com Google não está disponível nesta simulação.')}
        >
          <img src="/assets/social/google.svg" alt="" className="size-5" />
          Continuar com Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 gap-3 border-checkout-border bg-transparent text-sm text-muted-foreground dark:bg-transparent"
          onClick={() => toast.info('O acesso com Facebook não está disponível nesta simulação.')}
        >
          <img src="/assets/social/facebook-brand.svg" alt="" className="size-5" />
          Continuar com Facebook
        </Button>
      </div>
      <p className="mt-10 text-center text-md text-muted-foreground">
        {register ? 'Já tem uma conta?' : 'Novo na Kurio?'}{' '}
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-md font-normal text-foreground"
          onClick={() => {
            if (onRegisterChange) onRegisterChange(!register)
            else void navigate({ to: register ? '/login' : '/register', search: { returnTo } })
          }}
        >
          {register ? 'Entre' : 'Crie uma conta'}
        </Button>
      </p>
    </Card>
  )
}
