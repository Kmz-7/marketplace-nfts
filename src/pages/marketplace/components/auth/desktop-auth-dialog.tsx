import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function DesktopAuthDialog({ register }: { register: boolean }) {
  const navigate = useNavigate()

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) void navigate({ to: '/' })
      }}
    >
      <DialogContent
        className="max-h-[calc(100vh-2rem)] max-w-[344px] overflow-y-auto border-0 bg-card p-5"
        overlayClassName="bg-black/65"
      >
        <DialogTitle className="sr-only">{register ? 'Criar conta' : 'Entrar'}</DialogTitle>
        <DialogDescription className="sr-only">
          Entre para gerenciar sua carteira, coleção e perfil.
        </DialogDescription>
        <Tabs
          value={register ? 'register' : 'login'}
          onValueChange={(value) =>
            void navigate({ to: value === 'register' ? '/register' : '/login' })
          }
        >
          <TabsList variant="line" className="h-auto w-full justify-start gap-6 rounded-none p-0">
            <TabsTrigger value="login" className="rounded-none px-0 py-2 text-sm after:bg-primary">
              Entrar
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="rounded-none px-0 py-2 text-sm after:bg-primary"
            >
              Criar conta
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
          Entre para gerenciar sua carteira, coleção e perfil
        </p>
        <form className="mt-5 space-y-3" onSubmit={(event) => event.preventDefault()}>
          {register && (
            <Input aria-label="Nome de usuário" placeholder="Nome de usuário" variant="auth" />
          )}
          <Input type="email" aria-label="E-mail" placeholder="Digite seu e-mail" variant="auth" />
          <Input type="password" aria-label="Senha" placeholder="Senha" variant="auth" />
          {register && (
            <Input
              type="password"
              aria-label="Confirmar senha"
              placeholder="Confirmar senha"
              variant="auth"
            />
          )}
          {!register && (
            <Button type="button" variant="link" className="h-auto p-0 text-xs text-primary">
              Esqueceu a senha?
            </Button>
          )}
          <Button type="submit" className="h-10 w-full rounded-lg">
            {register ? 'Criar conta' : 'Entrar'}
          </Button>
        </form>
        <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          Ou continue com
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-4 grid gap-3">
          <Button variant="outline" className="h-10 rounded-lg">
            <span className="font-semibold text-primary">G</span> Continuar com Google
          </Button>
          <Button variant="outline" className="h-10 rounded-lg">
            <span className="font-semibold text-primary">f</span> Continuar com Facebook
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
