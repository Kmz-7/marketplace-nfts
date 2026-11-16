import { createFileRoute, redirect } from '@tanstack/react-router'

const localizedRouteAliases = {
  cadastro: '/register',
  carrinho: '/cart',
  carteiras: '/wallets',
  confirmacao: '/confirmation',
  entrar: '/login',
  pagamento: '/payment',
  perfil: '/profile',
} as const

export const Route = createFileRoute('/$legacy')({
  beforeLoad: ({ params }) => {
    const destination = localizedRouteAliases[params.legacy as keyof typeof localizedRouteAliases]
    if (destination) throw redirect({ to: destination })
  },
  component: () => (
    <main className="mx-auto w-full px-4 py-12 text-center text-muted-foreground">
      Página não encontrada.
    </main>
  ),
})
