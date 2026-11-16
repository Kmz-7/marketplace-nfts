import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMarketplaceState } from '@/components/providers/marketplace-state-provider'
import { HomeNftCard } from '@/pages/home/components/home-nft-card'

export function FavoritesPage() {
  const { favorites } = useMarketplaceState()

  return (
    <main className="py-8 md:py-10">
      <h1 className="mb-6 text-lg font-semibold text-foreground">Meus favoritos</h1>
      {favorites.length === 0 ? (
        <Card className="items-center gap-3 rounded-lg border border-border bg-card p-6 text-center shadow-none">
          <CardContent className="space-y-3 p-0">
            <p className="text-md text-secondary-foreground">
              Você ainda não adicionou NFTs aos favoritos.
            </p>
            <Button render={<Link to="/" hash="catalogo" />}>Explorar catálogo</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
          {favorites.map((nft) => (
            <HomeNftCard key={nft.id} {...nft} removeFromFavorites />
          ))}
        </div>
      )}
    </main>
  )
}
