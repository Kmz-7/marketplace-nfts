import { TriangleAlert } from 'lucide-react'
import { ChevronRightIcon } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HomeFilterSidebar } from '@/pages/home/components/home-filter-sidebar'
import { HomeNftCard } from '@/pages/home/components/home-nft-card'
import type { HomeNft } from '@/pages/home/components/home-nft-mapper'

export function HomeCatalog({
  nfts,
  isPending,
  isError,
  currentPage,
  totalPages,
  visiblePages,
  activeTab,
  onTabChange,
  selectedCollection,
  selectedNetwork,
  onCollectionChange,
  onNetworkChange,
  onPriceApply,
  onPageChange,
}: {
  nfts: HomeNft[]
  isPending: boolean
  isError: boolean
  currentPage: number
  totalPages: number
  visiblePages: number[]
  activeTab: string
  onTabChange: (tab: string) => void
  selectedCollection: string
  selectedNetwork: string
  onCollectionChange: (collection: string) => void
  onNetworkChange: (network: string) => void
  onPriceApply: (range: number[]) => void
  onPageChange: (page: number) => void
}) {
  return (
    <section
      id="catalogo"
      className="grid scroll-mt-20 gap-8 md:grid-cols-[12rem_minmax(0,1fr)] lg:grid-cols-[310px_minmax(0,1fr)] lg:gap-12"
      aria-label="Descobrir NFTs"
    >
      <HomeFilterSidebar
        selectedCollection={selectedCollection}
        selectedNetwork={selectedNetwork}
        onCollectionChange={onCollectionChange}
        onNetworkChange={onNetworkChange}
        onPriceApply={onPriceApply}
      />
      <div className="min-w-0">
        <Tabs
          value={activeTab}
          onValueChange={onTabChange}
          className="mb-6"
          aria-label="Categorias de NFTs"
        >
          <div className="flex flex-col justify-between gap-4 pb-4 lg:flex-row lg:items-center">
            <TabsList variant="line" className="h-auto justify-start gap-5 rounded-none p-0">
              <TabsTrigger
                value="all"
                className="flex-none rounded-none px-0 py-2 text-xs text-muted-foreground after:bg-primary data-active:text-primary"
              >
                Todos os NFTs
              </TabsTrigger>
              <TabsTrigger
                value="launches"
                className="flex-none rounded-none px-0 py-2 text-xs text-muted-foreground after:bg-primary data-active:text-primary"
              >
                Novos lançamentos
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="flex-none rounded-none px-0 py-2 text-xs text-muted-foreground after:bg-primary data-active:text-primary"
              >
                Em alta
              </TabsTrigger>
            </TabsList>
            <p className="text-xs text-muted-foreground">
              Ordenar por:{' '}
              <span className="text-foreground">
                {activeTab === 'trending'
                  ? 'Em alta'
                  : activeTab === 'launches'
                    ? 'Novos lançamentos'
                    : 'Recomendados'}
              </span>
            </p>
          </div>
          <TabsContent value={activeTab} className="mt-0">
            <div
              className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:gap-x-8 lg:gap-y-18"
              aria-busy={isPending}
            >
              {isPending &&
                Array.from({ length: 9 }, (_, index) => (
                  <Skeleton key={index} className="aspect-square w-full rounded-2xl" />
                ))}
              {isError && (
                /* No Figma, o erro aparecia como texto solto; o aviso usa fundo e borda discreta do sistema. */
                <Alert className="col-span-full border-border bg-card py-4 text-secondary-foreground">
                  <TriangleAlert className="size-4 text-primary" aria-hidden="true" />
                  <AlertDescription className="text-md text-secondary-foreground">
                    Não foi possível carregar os NFTs. Atualize a página para tentar novamente.
                  </AlertDescription>
                </Alert>
              )}
              {!isPending && !isError && nfts.length === 0 && (
                /* A borda sutil mantém o mesmo tratamento visual nos filtros sem resultados e nos erros de carregamento. */
                <Alert className="col-span-full border-border bg-card py-4 text-secondary-foreground">
                  <TriangleAlert className="size-4 text-muted-foreground" aria-hidden="true" />
                  <AlertDescription className="text-md text-secondary-foreground">
                    Nenhum NFT encontrado para os filtros aplicados. Ajuste os filtros e tente
                    novamente.
                  </AlertDescription>
                </Alert>
              )}
              {!isPending && !isError && nfts.map((nft) => <HomeNftCard key={nft.name} {...nft} />)}
            </div>
            <Pagination aria-label="Paginação dos NFTs" className="mt-8 justify-end">
              <PaginationContent>
                {visiblePages.map((page) => (
                  <PaginationItem key={page}>
                    <Button
                      onClick={() => onPageChange(page)}
                      variant={page === currentPage ? 'default' : 'ghost'}
                      size="icon-sm"
                      className={
                        page === currentPage
                          ? 'rounded-sm'
                          : 'rounded-sm border border-checkout-border'
                      }
                      aria-label={`Página ${page}`}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <Button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-sm border border-checkout-border"
                    aria-label="Próxima página"
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRightIcon />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
