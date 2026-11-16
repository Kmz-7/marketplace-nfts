import { lazy, Suspense, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const NftReviews = lazy(() =>
  import('@/pages/marketplace/components/nft/nft-reviews').then((module) => ({
    default: module.NftReviews,
  })),
)

export function NftInformationTabs({
  nftId,
  nftName,
  creator,
  edition,
}: {
  nftId: string
  nftName: string
  creator: string
  edition: string
}) {
  const [activeTab, setActiveTab] = useState('details')

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value ?? 'details')} className="mt-12 md:mt-16">
      <TabsList
        variant="line"
        className="h-auto w-full justify-start gap-8 rounded-none border-b border-border p-0"
      >
        <TabsTrigger
          value="details"
          className="flex-none rounded-none px-0 py-3 text-xs text-muted-foreground after:bg-primary data-active:text-primary"
        >
          Detalhes do NFT
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="flex-none rounded-none px-0 py-3 text-xs text-muted-foreground after:bg-primary data-active:text-primary"
        >
          Avaliações
        </TabsTrigger>
      </TabsList>
      {/* No Figma, os parágrafos do detalhe usavam afastamentos diferentes; space-y-3 dá ritmo regular ao conteúdo. */}
      {/* No Figma, a primeira linha ficava colada ao menu da aba; o padding superior cria um início de conteúdo claro. */}
      <TabsContent value="details" className="space-y-3 pt-6 text-md leading-6 text-muted-foreground">
        <p>
          {nftName} é uma obra digital {edition} finalizada à mão por {creator}. Cada atributo fica
          armazenado nos metadados do token e verificado na Ethereum. A obra explora
          identidade, movimento e luz em um mundo digital sem fronteiras.
        </p>
        <p>
          A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores
          e um registro permanente de procedência na rede. {creator} recebe 5% de
          direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da
          comunidade.
        </p>
        <p>
          <span className="font-semibold text-foreground">Rede:</span>
          <br />
          Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS
        </p>
        <p>
          <span className="font-semibold text-foreground">Contrato:</span>
          <br />
          Direitos autorais de {creator}: 5% nas vendas secundárias, pagos automaticamente pelos
          mercados compatíveis.
        </p>
        <p>
          <span className="font-semibold text-foreground">Direitos autorais:</span>
          <br />
          Contrato inteligente ERC-721 verificado.
        </p>
      </TabsContent>
      <TabsContent value="reviews" className="pt-7">
        {activeTab === 'reviews' && (
          <Suspense
            fallback={
              <div role="status" aria-label="Carregando avaliações" className="space-y-3">
                <div className="h-20 animate-pulse rounded-lg bg-muted" />
                <div className="h-28 animate-pulse rounded-lg bg-muted" />
                <div className="h-28 animate-pulse rounded-lg bg-muted" />
              </div>
            }
          >
            <NftReviews nftId={nftId} />
          </Suspense>
        )}
      </TabsContent>
    </Tabs>
  )
}
