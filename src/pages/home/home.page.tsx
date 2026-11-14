import { ArrowRightIcon, ChevronRightIcon, HeartIcon, HomeIcon, ScanLineIcon, ShoppingCartIcon, SlidersHorizontalIcon, UserRoundIcon } from '@/components/ui/icons'
import { Search as LucideSearch } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { HomeFilterSidebar } from './components/home-filter-sidebar'
import { HomeJournal } from './components/home-journal'
import { HomeNftCard } from './components/home-nft-card'

const nfts = [
  { name: 'Emerald Ape #042', creator: 'ETH', image: '/assets/marketplace/ape-sunglasses.png', price: '1.19' },
  { name: 'Sage Nomad #009', creator: 'ETH', image: '/assets/marketplace/ape-explorer.png', price: '1.69' },
  { name: 'Neon Vessel #552', creator: 'ETH', image: '/assets/marketplace/ape-cream-coat.png', price: '1.99', previousPrice: '2.29' },
  { name: 'Cosmo Bloom #118', creator: 'ETH', image: '/assets/marketplace/ape-explorer.png', price: '1.29' },
  { name: 'Violet Nomad #314', creator: 'ETH', image: '/assets/marketplace/ape-explorer.png', price: '1.39' },
  { name: 'Ivory Baron #883', creator: 'ETH', image: '/assets/marketplace/ape-cream-coat.png', price: '1.79' },
  { name: 'Golden Beat #287', creator: 'ETH', image: '/assets/marketplace/ape-headphones.png', price: '0.99' },
  { name: 'Golden Hour #409', creator: 'ETH', image: '/assets/marketplace/ape-headphones.png', price: '0.89', imageOnly: true },
  { name: 'Golden Signal #160', creator: 'ETH', image: '/assets/marketplace/ape-headphones.png', price: '0.39' },
]

export function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const visiblePages = currentPage <= 3
    ? [1, 2, 3, 4]
    : [1, currentPage, currentPage + 1, currentPage + 2].filter((page) => page <= 10)

  return (
    <>
    <MobileHome />
    <main className="hidden flex-col gap-16 pb-16 md:flex lg:gap-24">
      <section className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_0.9fr] lg:min-h-[450px] lg:grid-cols-[minmax(0,640px)_minmax(0,450px)] lg:justify-between" aria-labelledby="home-hero-title">
        <div className="max-w-[600px] lg:pl-10">
          <p className="mb-4 text-sm font-semibold text-foreground">Bem-vindo à Kurio</p>
          <h1 id="home-hero-title" className="max-w-[600px] text-3xl leading-[1.2] font-bold uppercase sm:text-4xl lg:text-[43px] lg:leading-[70px]">
            Seja dono do futuro<br className="hidden lg:block" /> da arte digital
          </h1>
          <p className="mt-4 max-w-[600px] text-sm leading-6 text-muted-foreground">
            Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
          </p>
          <Button render={<a href="#catalogo" />} className="mt-6 h-9 px-6 text-xs uppercase tracking-wide">
            Explorar
          </Button>
          <div className="mt-8 flex justify-end gap-2 pr-3" aria-label="Slide 1 de 3">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
            <span className="size-1.5 rounded-full bg-muted-foreground/40" />
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[450px] overflow-hidden rounded-3xl bg-card md:ml-auto">
          <img
            src="/assets/marketplace/ape-sunglasses.png"
            alt="NFT de macaco com óculos e jaqueta verde"
            className="aspect-square w-full object-cover"
          />
        </div>
      </section>

      <section id="catalogo" className="grid scroll-mt-20 gap-8 md:grid-cols-[12rem_minmax(0,1fr)] lg:grid-cols-[310px_minmax(0,1fr)] lg:gap-12" aria-label="Descobrir NFTs">
        <HomeFilterSidebar />
        <div className="min-w-0">
          <div className="mb-6 flex flex-col justify-between gap-4 pb-4 lg:flex-row lg:items-center">
            <nav aria-label="Categorias de NFTs">
              <NavigationMenu className="w-full max-w-none flex-none justify-start">
                <NavigationMenuList className="flex-wrap justify-start gap-5 text-xs sm:gap-6">
                  <NavigationMenuItem><NavigationMenuLink href="#catalogo" className="h-auto border-b border-primary p-0 pb-2 text-xs text-primary hover:bg-transparent">Todos os NFTs</NavigationMenuLink></NavigationMenuItem>
                  <NavigationMenuItem><NavigationMenuLink href="#lancamentos" className="h-auto border-b border-transparent p-0 pb-2 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground">Novos lançamentos</NavigationMenuLink></NavigationMenuItem>
                  <NavigationMenuItem><NavigationMenuLink href="#destaques" className="h-auto border-b border-transparent p-0 pb-2 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground">Em alta</NavigationMenuLink></NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
            <p className="text-xs text-muted-foreground">Ordenar por: <span className="text-foreground">Listados recentemente</span></p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:gap-x-8 lg:gap-y-[72px]">
            {nfts.map((nft) => <HomeNftCard key={nft.name} {...nft} />)}
          </div>
          <Pagination aria-label="Paginação dos NFTs" className="mt-8 justify-end">
            <PaginationContent>
              {visiblePages.map((page) => (
                <PaginationItem key={page}><Button onClick={() => setCurrentPage(page)} variant={page === currentPage ? 'default' : 'ghost'} size="icon-sm" className={page === currentPage ? 'rounded-sm' : 'rounded-sm border border-[#3F2319]'} aria-label={`Página ${page}`} aria-current={page === currentPage ? 'page' : undefined}>{page}</Button></PaginationItem>
              ))}
              <PaginationItem><Button onClick={() => setCurrentPage((page) => Math.min(page + 1, 10))} variant="ghost" size="icon-sm" className="rounded-sm border border-[#3F2319]" aria-label="Próxima página" disabled={currentPage === 10}><ChevronRightIcon /></Button></PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      <section id="lancamentos" className="grid gap-4 md:grid-cols-2" aria-label="Destaques da Kurio">
        <PromoBanner
          image="/assets/marketplace/ape-sunglasses.png"
          imageAlt="Macaco com óculos de sol e jaqueta verde"
          eyebrow="Colecione edições escassas diretamente dos criadores antes da revelação pública"
          eyebrowClassName=""
          title={<><span className="block">Lançamentos gênesis</span><span className="block">de edição limitada</span></>}
        />
        <PromoBanner
          image="/assets/marketplace/ape-cream-coat.png"
          imageAlt="Macaco com casaco claro"
          eyebrow="Explore novos artistas, coleções verificadas e obras digitais que definem a"
          eyebrowClassName="max-w-[250px]"
          title={<><span className="block">Arte digital selecionada</span><span className="block">e muito mais</span></>}
        />
      </section>

      <HomeJournal />
    </main>
    </>
  )
}

function MobileHome() {
  const mobileNfts = [nfts[0], nfts[1], nfts[2], nfts[6], nfts[3], nfts[5]]
  return (
    <main className="pb-28 pt-8 md:hidden">
      <div className="sticky top-0 z-30 -mx-4 flex gap-2 bg-background/70 px-4 py-3 backdrop-blur-md">
        <div className="relative flex-1"><LucideSearch className="absolute top-3 left-3 size-5 text-muted-foreground" /><Input aria-label="Explorar coleções" placeholder="Explorar coleções" className="h-11 rounded-xl border-0 bg-card pl-11 text-xs" /></div>
        <Button size="icon-lg" className="size-11 rounded-xl" aria-label="Filtros"><SlidersHorizontalIcon /></Button>
      </div>
      <Card className="relative mt-4 grid grid-cols-[1.2fr_1fr] gap-2 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#8e5b35] to-[#281910] p-4 ring-0">
        <CardContent className="p-0"><p className="text-xs">Bem-vindo à Kurio</p><h1 className="mt-3 text-lg leading-7 font-bold uppercase">Seja dono da cultura digital</h1><p className="mt-2 text-xs leading-5 text-muted-foreground">Descubra NFTs selecionados de criadores do mundo todo.</p><Button render={<a href="#catalogo-mobile" />} variant="link" className="mt-1 h-auto gap-2 p-0 text-xs font-semibold">EXPLORAR <ArrowRightIcon className="size-4" /></Button></CardContent>
        <img src="/assets/marketplace/ape-sunglasses.png" alt="NFT Emerald Ape" className="aspect-square w-full rounded-2xl object-cover" />
        <div className="col-span-2 flex justify-center gap-1"><span className="size-1.5 rounded-full bg-primary" /><span className="size-1.5 rounded-full bg-primary/50" /><span className="size-1.5 rounded-full bg-primary/50" /></div>
      </Card>
      <section id="catalogo-mobile" className="mt-4 scroll-mt-20"><nav aria-label="Categorias de NFTs"><NavigationMenu className="w-full max-w-none flex-none justify-start"><NavigationMenuList className="w-full justify-between gap-2 whitespace-nowrap text-xs"><NavigationMenuItem><NavigationMenuLink href="#catalogo-mobile" className="h-auto border-b border-primary p-0 pb-2 text-xs text-primary hover:bg-transparent">Todos os NFTs</NavigationMenuLink></NavigationMenuItem><NavigationMenuItem><NavigationMenuLink href="#lancamentos" className="h-auto border-b border-transparent p-0 pb-2 text-xs hover:bg-transparent">Novos lançamentos</NavigationMenuLink></NavigationMenuItem><NavigationMenuItem><NavigationMenuLink href="#destaques" className="h-auto border-b border-transparent p-0 pb-2 text-xs hover:bg-transparent">Em alta</NavigationMenuLink></NavigationMenuItem></NavigationMenuList></NavigationMenu></nav>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6">{mobileNfts.map((nft) => <HomeNftCard key={nft.name} {...nft} />)}</div>
      </section>
      <nav aria-label="Navegação mobile" className="fixed inset-x-0 bottom-0 z-20 mx-auto flex h-20 max-w-lg items-center justify-around rounded-t-[28px] bg-secondary px-3 text-muted-foreground shadow-xl">
        <Button render={<a href="/" />} variant="ghost" size="icon" aria-label="Início" className="text-primary"><HomeIcon /></Button><Button render={<a href="/perfil" />} variant="ghost" size="icon" aria-label="Favoritos"><HeartIcon /></Button><Button size="icon-lg" className="-mt-10 size-14 rounded-full" aria-label="Explorar"><ScanLineIcon /></Button><Button render={<a href="/carrinho" />} variant="ghost" size="icon" aria-label="Carrinho"><ShoppingCartIcon /></Button><Button render={<a href="/perfil" />} variant="ghost" size="icon" aria-label="Perfil"><UserRoundIcon /></Button>
      </nav>
    </main>
  )
}

function PromoBanner({ image, imageAlt, eyebrow, eyebrowClassName = '', title }: { image: string; imageAlt: string; eyebrow: string; eyebrowClassName?: string; title: ReactNode }) {
  return (
    <Card className="grid h-[250px] grid-cols-2 gap-0 overflow-hidden rounded-2xl border-0 bg-card p-0 ring-0">
      <img src={image} alt={imageAlt} className="h-full min-h-0 w-full rounded-2xl object-cover" />
      <CardContent className="flex flex-col items-end justify-center p-4 !ps-0 text-right sm:p-5">
        <h2 className="w-full text-lg leading-5 font-semibold text-foreground">{title}</h2>
        <p className={`mt-2 text-sm leading-4 text-muted-foreground ${eyebrowClassName}`}>{eyebrow}</p>
        <Button size="sm" className="mt-3 h-7 gap-2 px-4 text-[10px]">Explorar <ArrowRightIcon className="size-3.5" /></Button>
      </CardContent>
    </Card>
  )
}
