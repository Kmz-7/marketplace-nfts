import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { AuthFormFields } from './auth-form-fields'
import { useAuthForm } from './use-auth-form'

export function DesktopAuthDialog({
  register,
  returnTo,
  open = true,
  onOpenChange,
  onRegisterChange,
  onSuccess,
}: {
  register: boolean
  returnTo?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onRegisterChange?: (register: boolean) => void
  onSuccess?: () => void
}) {
  const navigate = useNavigate()
  const authForm = useAuthForm(register, returnTo, onSuccess)

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (onOpenChange) onOpenChange(open)
        else if (!open) void navigate({ to: returnTo ?? '/' })
      }}
    >
      {/* No Figma, o fundo do login ficava sem desfoque; o overlay escurecido e blur realçam o diálogo sem trocar a página. */}
      <DialogContent
        className="auth-dialog-content flex max-h-[calc(100dvh-2rem)] flex-col items-center gap-0 overflow-y-auto rounded-lg border border-border border-b-8 border-b-primary bg-secondary p-0"
        overlayClassName="bg-background/65 backdrop-blur-sm supports-backdrop-filter:backdrop-blur-sm"
      >
        <DialogTitle className="sr-only">{register ? 'Criar conta' : 'Entrar'}</DialogTitle>
        <DialogDescription className="sr-only">
          Entre para gerenciar sua carteira, coleção e perfil.
        </DialogDescription>
        <nav aria-label="Acesso à conta" className="mt-1 flex items-center justify-center gap-1">
          <Button
            type="button"
            variant="ghost"
            aria-current={!register ? 'page' : undefined}
            className={`h-6 rounded-none bg-transparent px-0 text-sm hover:bg-transparent ${!register ? 'text-primary hover:text-primary' : 'text-foreground hover:text-primary'}`}
            onClick={() =>
              onRegisterChange
                ? onRegisterChange(false)
                : void navigate({ to: '/login', search: { returnTo } })
            }
          >
            Entrar
          </Button>
          <span className="text-sm text-muted-foreground">|</span>
          <Button
            type="button"
            variant="ghost"
            aria-current={register ? 'page' : undefined}
            className={`h-6 rounded-none bg-transparent px-0 text-sm hover:bg-transparent ${register ? 'text-primary hover:text-primary' : 'text-foreground hover:text-primary'}`}
            onClick={() =>
              onRegisterChange
                ? onRegisterChange(true)
                : void navigate({ to: '/register', search: { returnTo } })
            }
          >
            Criar conta
          </Button>
        </nav>
        <p className="mt-6 text-center text-xs leading-4 text-foreground">
          {register
            ? 'Crie sua conta para gerenciar sua carteira, coleção e perfil de criador.'
            : 'Entre para gerenciar sua carteira, coleção e perfil de criador.'}
        </p>
        <form noValidate className="w-full px-8 mt-4 grid gap-2" onSubmit={authForm.handleSubmit}>
          <AuthFormFields
            register={register}
            variant="authDialog"
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
              className="mt-0 h-auto justify-self-end p-0 text-xs font-normal text-primary hover:text-primary"
              onClick={() =>
                toast.info('A recuperação de senha não está disponível nesta simulação.')
              }
            >
              Esqueceu a senha?
            </Button>
          )}
          <Button
            type="submit"
            className="mt-3 h-8 w-full rounded-sm text-xs"
            disabled={authForm.isPending}
          >
            {authForm.isPending ? 'Aguarde...' : register ? 'Criar conta' : 'Entrar'}
          </Button>
        </form>
        <div className="mt-5 flex w-full items-center gap-2 text-center text-xs text-foreground">
          <span className="h-px flex-1 -ms-10 bg-border" />
          <span className="shrink-0">Ou continue com</span>
          <span className="h-px flex-1 -me-7.5 bg-border" />
        </div>
        <div className="space-y-3 mt-5 mb-10 grid w-full px-8">
          <Button
            variant="outline"
            className="h-8 rounded-sm border-checkout-border bg-transparent! px-2 text-xs text-muted-foreground font-normal hover:bg-card hover:text-foreground"
            onClick={() => toast.info('O acesso com Google não está disponível nesta simulação.')}
          >
            <img src="/assets/helpers/google.svg" alt="" className="h-3.5 w-auto me-1" />
            Continuar com Google
          </Button>
          <Button
            variant="outline"
            className="h-8 rounded-sm border-checkout-border bg-transparent! px-2 text-xs text-muted-foreground hover:bg-card hover:text-foreground"
            onClick={() => toast.info('O acesso com Facebook não está disponível nesta simulação.')}
          >
            <img src="/assets/helpers/facebook.svg" alt="" className="h-3.5 w-auto me-1" />
            Continuar com Facebook
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
