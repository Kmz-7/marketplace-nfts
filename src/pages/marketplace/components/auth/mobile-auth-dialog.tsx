import { useNavigate } from '@tanstack/react-router'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { AuthForm } from './auth-form'

/**
 * Acesso mobile (frames Mobile / Login e Mobile / Cadastro): ocupa a viewport inteira como uma tela,
 * diferente do diálogo compacto do desktop.
 */
export function MobileAuthDialog({
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

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (onOpenChange) onOpenChange(nextOpen)
        else if (!nextOpen) void navigate({ to: returnTo ?? '/' })
      }}
    >
      {/* O translate centralizador do DialogContent empurrava a tela de acesso para fora da viewport; a variante fullscreen o zera. */}
      <DialogContent variant="fullscreen" closeLabel="Fechar acesso">
        <DialogTitle className="sr-only">{register ? 'Criar perfil de colecionador' : 'Entrar'}</DialogTitle>
        <DialogDescription className="sr-only">
          Entre para gerenciar sua carteira, coleção e perfil.
        </DialogDescription>
        <AuthForm
          register={register}
          returnTo={returnTo}
          onRegisterChange={onRegisterChange}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
