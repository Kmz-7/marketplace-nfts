import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { HomeNftCard } from '@/pages/home/components/home-nft-card'
import type { HomeNft } from '@/pages/home/components/home-nft-mapper'

export function MobileHomeCatalog({ nfts, loading }: { nfts: HomeNft[]; loading: boolean }) {
  const mobileNfts = [nfts[0], nfts[1], nfts[2], nfts[6], nfts[3], nfts[5]].filter(
    (nft) => nft !== undefined,
  )

  return (
    <section id="catalogo-mobile" className="mt-4 scroll-mt-20">
      <nav aria-label="Categorias de NFTs">
        <NavigationMenu className="w-full max-w-none flex-none justify-start">
          <NavigationMenuList className="w-full justify-between gap-2 whitespace-nowrap text-xs">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#catalogo-mobile"
                className="h-auto border-b border-primary p-0 pb-2 text-xs text-primary hover:bg-transparent"
              >
                Todos os NFTs
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#lancamentos"
                className="h-auto border-b border-transparent p-0 pb-2 text-xs hover:bg-transparent"
              >
                Novos lançamentos
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#destaques"
                className="h-auto border-b border-transparent p-0 pb-2 text-xs hover:bg-transparent"
              >
                Em alta
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6" aria-busy={loading}>
        {loading
          ? Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="aspect-square w-full rounded-2xl" />
            ))
          : mobileNfts.map((nft) => <HomeNftCard key={nft.name} {...nft} />)}
      </div>
    </section>
  )
}
