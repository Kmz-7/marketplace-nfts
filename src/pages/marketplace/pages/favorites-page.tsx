import { Link, useNavigate } from '@tanstack/react-router'
import { StatusAlert, StatusAlertAction } from '@/components/status-alert'
import { Card, CardContent } from '@/components/ui/card'
import { HeartIcon } from '@/components/ui/icons'
import { useMarketplaceState } from '@/components/providers/marketplace-state-provider'
import { HomeNftCard } from '@/pages/home/components/home-nft-card'
import { MobileMarketplaceHeader } from '@/pages/marketplace/components/mobile-marketplace-header'

export function FavoritesPage() {
  const navigate = useNavigate()
  const { favorites } = useMarketplaceState()
  const count = favorites.length

  return (
    <main className="-mx-4 px-6 pt-6 pb-10 md:mx-0 md:px-0 md:py-10">
      <MobileMarketplaceHeader title="Favoritos" onBack={() => void navigate({ to: '/' })} />

      {/* Resumo da coleção favorita: substitui o título solto por um painel com contagem, no mesmo gradiente dos cards. */}
      <Card className="mt-5 gap-0 rounded-2xl border border-primary/20 p-0 shadow-lg ring-0 surface-gradient md:mt-0">
        <CardContent className="flex items-center gap-4 p-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <HeartIcon variant="Bold" className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 space-y-1">
            <h1 className="text-lg font-bold text-foreground">Meus favoritos</h1>
            <p className="text-sm text-muted-foreground">
              {count === 0
                ? 'Salve artes para acompanhar preços e edições.'
                : `${count} ${count === 1 ? 'NFT salvo' : 'NFTs salvos'} para acompanhar preços e edições.`}
            </p>
          </div>
        </CardContent>
      </Card>

      {count === 0 ? (
        <StatusAlert
          tone="empty"
          className="mt-6"
          title="Nenhum favorito ainda"
          description="Toque no coração de uma arte para guardá-la aqui."
          action={<StatusAlertAction render={<Link to="/" hash="catalogo" />}>Explorar catálogo</StatusAlertAction>}
        />
      ) : (
        <section aria-label="NFTs favoritos" className="mt-6">
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:gap-x-4 md:gap-y-7 lg:grid-cols-4">
            {favorites.map((nft) => (
              <HomeNftCard key={nft.id} {...nft} removeFromFavorites />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
