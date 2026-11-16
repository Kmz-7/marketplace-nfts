import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function AuthForm({ register }: { register: boolean }) {
  return (
    <Card className="flex min-h-[85vh] w-full flex-col justify-center gap-0 rounded-none bg-transparent py-10 ring-0 md:min-h-0 md:rounded-lg md:p-8">
      <Button
        render={<a href="/" />}
        variant="ghost"
        className="h-auto p-0 text-3xl font-bold tracking-[0.15em] hover:bg-transparent"
      >
        KURIO
      </Button>
      <h1 className="mt-16 text-center text-lg font-semibold md:mt-8">
        {register ? 'Criar perfil de colecionador' : 'Entrar'}
      </h1>
      <form className="mt-8 space-y-3" onSubmit={(event) => event.preventDefault()}>
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
        {!register && <p className="text-right text-xs text-primary">Esqueceu a senha?</p>}
        <Button type="submit" className="mt-6 h-14 w-full">
          {register ? 'Criar perfil' : 'Entrar'}
        </Button>
      </form>
      <div className="mt-10 flex items-center gap-3 text-xs">
        <span className="h-px flex-1 bg-border" />
        Ou continue com
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="mt-4 grid gap-3">
        <Button variant="outline" className="h-10">
          Continuar com Google
        </Button>
        <Button variant="outline" className="h-10">
          Continuar com Facebook
        </Button>
      </div>
      <p className="mt-10 text-center text-xs text-muted-foreground">
        {register ? 'Já tem uma conta?' : 'Novo na Kurio?'}{' '}
        <Button
          render={<a href={register ? '/login' : '/register'} />}
          variant="link"
          className="h-auto p-0 text-xs font-normal text-foreground"
        >
          {register ? 'Entre' : 'Crie uma conta'}
        </Button>
      </p>
    </Card>
  )
}
