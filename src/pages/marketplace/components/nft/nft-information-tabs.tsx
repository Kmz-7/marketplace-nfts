import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function NftInformationTabs() {
  return (
    <Tabs defaultValue="details" className="mt-12 md:mt-16">
      <TabsList
        variant="line"
        className="h-auto w-full justify-start gap-8 rounded-none border-b border-border p-0"
      >
        <TabsTrigger
          value="details"
          className="flex-none rounded-none px-0 py-3 text-sm text-muted-foreground after:bg-primary data-active:text-primary"
        >
          Detalhes do NFT
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="flex-none rounded-none px-0 py-3 text-sm text-muted-foreground after:bg-primary data-active:text-primary"
        >
          Avaliações
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="space-y-5 text-sm leading-6 text-muted-foreground">
        <p>
          Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada
          atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora
          identidade, movimento e luz em um mundo digital sem fronteiras.
        </p>
        <br />
        <p>
          A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores
          e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de
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
          Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos
          mercados compatíveis.
        </p>
        <p>
          <span className="font-semibold text-foreground">Direitos autorais:</span>
          <br />
          0x7A42...19E8 • Contrato inteligente ERC-721 verificado.
        </p>
      </TabsContent>
      <TabsContent value="reviews" className="pt-7">
        <Card className="rounded-xl border-border bg-card p-5 shadow-none">
          <CardContent className="p-0">
            <h2 className="text-sm font-semibold text-foreground">Avaliações de colecionadores</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              As avaliações de clientes para este NFT serão exibidas aqui.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
