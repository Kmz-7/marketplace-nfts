# Projeto: decisões, estado e cronograma

## Estado para entrega — 16/11/2026

- `npm ci`, `npm run typecheck` e `npm run build` passaram; `npm run lint` não tem erros e registra nove avisos não bloqueantes de Fast Refresh.
- Playwright: 28 aprovados e dois ignorados por viewport, incluindo regressões visuais mobile/desktop de Home, detalhe, carrinho e pagamento.
- Lighthouse desktop atende às metas. No mobile, detalhe atinge Performance 90 e a Home fica em 86; causa e relatórios estão em [`audits/lighthouse/README.md`](./audits/lighthouse/README.md).
- A documentação de entrega cobre setup, credenciais fictícias, cenários, reset, comandos e arquitetura. A URL Vercel responde na Home, mas acesso direto a `/nft` e `/cart` ainda dá 404; `vercel.json` contém o rewrite que precisa ser publicado.
- Limites de implementação ainda relevantes: favoritos e alterações de perfil/carteiras não persistem pela API; a suíte não cobre integralmente os 12 grupos E2E do enunciado. Consulte `README.md`, `ARCHITECTURE.md` e `MOCK_BACKEND.md` antes de declarar conformidade completa.

## Organização atual

- `src/types/`: contratos compartilhados de usuário/sessão/erro, pedido e NFT.
- `src/api/`: serviços REST tipados para autenticação, catálogo, carrinho/cotação e pedidos, todos via Axios.
- `src/hooks/use-auth.ts`: consulta de sessão, mutations de login/cadastro/logout e sincronização do cache.
- `src/mocks/fixtures/`: builders para duas contas de acesso, vinte perfis avaliadores, dois pedidos, 18 NFTs e avaliações.
- `src/mocks/handlers/`: cadastro, login, sessão, logout, carrinho/cotação, pedidos e endpoints de catálogo/cenários.
- `src/mocks/state/auth.store.ts`: contas e sessão simuladas persistidas, com senha derivada por PBKDF2 e sem senha em texto claro.
- `src/mocks/socket/`: conexões Socket.IO simuladas pelo binding WebSocket do MSW.
- `src/components/layout/`: layout padrão, header e footer compartilhados por todas as rotas.
- `src/pages/home/home.page.tsx`: conteúdo da página inicial, renderizado dentro do layout padrão.

O catálogo da Home é carregado por Axios + TanStack Query e interceptado pelo MSW. Os registros e eventos `nft.updated` compartilham estado em memória no worker; os cenários controláveis incluem sucesso, demora, falha de rede e HTTP 503. Cadastro, login, logout, consulta/expiração de sessão, carrinho, cotação, cupons, criação idempotente de pedidos e atualização `order.updated` estão integrados ao MSW. O checkout usa os itens do carrinho, e a confirmação lê o snapshot persistido pela API e reconcilia pedidos pendentes via socket e REST. Favoritos e mutações de perfil/carteiras continuam pendentes. O Figma confirma `#140D0A` em Color/Ink; outros tons em `src/styles.css` são aproximações visuais que precisam ser conferidas nos elementos correspondentes. Veja [MOCK_BACKEND.md](./MOCK_BACKEND.md) para credenciais, endpoints e cenários.

### Endpoints simulados atualmente

- `GET /api/nfts`: lista paginada com busca, filtros, ordenação e 18 fixtures.
- `GET /api/nfts/:nftId`: consulta um NFT por identificador.
- `GET /api/nfts/:nftId/reviews`: retorna avaliações e média de cada NFT; `GET /api/users` lista perfis fictícios seed.
- `POST /api/mock/nfts/:nftId/update`: atualiza preço/disponibilidade e emite `nft.updated`.
- `POST /api/mock/scenario` e `POST /api/mock/reset`: controlam latência/falha e restauram o catálogo.
- `POST /api/auth/register`: cria conta, valida campos, verifica conflito e inicia sessão.
- `POST /api/auth/login`: autentica usuário e senha.
- `GET /api/session` e `POST /api/auth/logout`: recuperam ou encerram a sessão persistente.
- `POST /api/mock/session/expire`: simula expiração de sessão.
- `GET /api/users/:userId`: retorna uma conta seed ou cadastrada ou `404 USER_NOT_FOUND`.
- `GET /api/cart`, `PUT /api/cart` e `POST /api/cart/quote`: carrinho, disponibilidade por edição e cotação.
- `POST /api/orders`: cria pedido idempotente após cotação; `GET /api/orders/:orderId` exige sessão e propriedade do pedido.
- `POST /api/mock/commerce-scenario`: alterna confirmação, recusa, pendência e timeout recuperável de pedido.
- `POST /api/mock/orders/:orderId/status`: confirma ou recusa pedido pendente e emite `order.updated` à sessão correspondente.

## Estrutura da Home

A página de rota `/` é composta em `src/pages/home/home.page.tsx`. Ela contém três áreas para a implementação visual: hero com chamada e arte principal; descoberta com filtros de coleção/preço/rede, abas, ordenação, grid de NFTs e paginação; e área promocional de destaques. Header e footer ficam fora do conteúdo `<main>` e devem ser implementados no layout compartilhado. As áreas editoriais do frame não entram no escopo funcional do desafio.

## Tokens iniciais de interface

Os tokens vivem em `src/styles.css` e o Tailwind os expõe como classes (`bg-background`, `text-foreground`, `bg-primary`, `border-border`). O Figma confirma `#140D0A` para `Color/Ink` da tela inicial. O laranja e os tons secundários do CSS foram estimados visualmente no arquivo; valide/ajuste os hex exatos inspecionando os elementos correspondentes no Figma.

## Ordem recomendada de desenvolvimento

A sequência abaixo reduz retrabalho: primeiro define os contratos e os dados simulados, depois constrói os fluxos sobre essa base e deixa auditorias para quando a experiência estiver completa.

### 1. Ler os frames e definir decisões do produto

- Conferir frames desktop/mobile e comentários relevantes do Figma; adotar o frame 206 do Grid Rows como referência, conforme comentário no arquivo.
- Inventariar rotas, componentes compartilhados, breakpoints, fontes/assets e estados não desenhados (carregando, vazio, erro, indisponível).
- Definir decisões que afetam vários fluxos: moeda ETH como string decimal, política de sessão, persistência do carrinho, autenticação e regras de atualização de preço.

**Pronto quando:** existe uma lista das telas e estados, e as decisões principais estão registradas.

### 2. Fechar a arquitetura e contratos REST/eventos

- Especificar tipos de transporte para sessão, usuário, NFT/edição, carrinho, cotação, pedido/recibo, perfil e carteira.
- Descrever endpoints, parâmetros, respostas e erros esperados (401, 403, 404, 409, 422 e falha transitória).
- Definir os eventos `nft.updated` e `order.updated` com identidade estável, recurso, versão e regra para duplicatas/ordem antiga.
- Definir política de cache/retry do TanStack Query, isolamento por usuário e comportamento após reconexão.

**Pronto quando:** contratos REST/eventos e decisões de sessão/cache estão escritos em `ARCHITECTURE.md`.

### 3. Implementar a API simulada com MSW

- Criar fixtures estáveis e variadas, incluindo pelo menos dois usuários e catálogo suficiente para filtro e paginação.
- Criar handlers por recurso e uma camada de estado compartilhada para catálogo, favoritos, carrinho, perfil, carteiras e pedidos.
- Implementar login/sessão, validações, erros, preço/estoque, cupons, cotação e pedido idempotente.
- Criar cenários configuráveis de sucesso, vazio, demora, falha de rede, 4xx/5xx, sessão expirada, conflitos, alteração de preço/estoque, timeout recuperável e pagamento aprovado/recusado.
- Implementar reset determinístico e persistência compatível com refresh.
- Configurar o binding Socket.IO do MSW, mantendo os eventos sincronizados com o estado que REST retorna.

**Pronto quando:** REST e eventos conseguem conduzir os cenários sem lógica fictícia dentro de componentes.

### 4. Montar fundação da aplicação

- Criar layout global, tokens do Figma em CSS/Tailwind, tipografia, navegação e componentes comuns com shadcn/ui.
- Configurar Router com rotas previstas, parâmetros de busca tipados e páginas de erro/rota inexistente.
- Configurar QueryClient, Axios com base URL/interceptadores e serviços tipados.
- Implementar provider de sessão, proteção de rotas e limpeza de cache/subscriptions no logout/troca de usuário.
- Confirmar que o mock liga/desliga por configuração e também funciona no build de demonstração.

**Pronto quando:** todas as rotas abrem diretamente e a estrutura consegue consumir handlers MSW.

### 5. Construir descoberta: início, catálogo e detalhe

- Implementar catálogo, busca, filtros combináveis, ordenação e paginação com estado na URL.
- Fazer refresh/histórico restaurarem filtros e página; resetar página ao mudar filtro.
- Implementar estados de carregamento com skeleton shimmer, vazio, erro, retry e atualização em segundo plano.
- Criar detalhe com galeria, edição, limite de quantidade e caso inexistente/indisponível.
- Implementar favoritos persistidos para usuário autenticado e ao menos uma mutation otimista com rollback.
- Ajustar layout nos viewports 390, 768 e 1440 px.

**Pronto quando:** busca e detalhe funcionam via API simulada, inclusive acesso direto, erros e histórico.

### 6. Implementar conta e sessão

- Criar cadastro, login, logout, consulta/recuperação de sessão e expiração.
- Preservar destino/contexto para retomar o fluxo após autenticar.
- Criar perfil com atualização de dados/avatar e alteração de senha.
- Criar cadastro/edição de carteira principal e secundária.
- Tratar erros da API, refresh, troca de usuário e isolamento/limpeza de dados privados.

**Pronto quando:** dados persistem após refresh e nenhuma informação privada atravessa sessões.

### 7. Implementar carrinho e cotação

- Adicionar, editar quantidade e remover itens respeitando disponibilidade por NFT/edição.
- Persistir carrinho no refresh e incorporar itens do visitante após login.
- Aplicar/remover cupom e tratar inválido/expirado.
- Calcular/exibir subtotal, desconto, taxa de rede e total a partir da API, sem perda de precisão em ETH (usar decimal string e biblioteca decimal se necessário).
- Atualizar resumo quando preço/estoque mudar.

**Pronto quando:** o carrinho restaura estado e os valores exibidos são resposta da cotação simulada.

### 8. Implementar checkout, pedido e recibo

- Validar dados do colecionador, carteira/rede e permitir revisão antes do envio.
- Revalidar preço, estoque, cupom e taxas; mudanças precisam de nova confirmação.
- Enviar chave de idempotência e recuperar o mesmo pedido após timeout/reenvio, sem duplicar compra.
- Representar pedido pendente, confirmado e recusado; só mostrar confirmação quando a simulação confirmar.
- Preservar carrinho em falhas e remover apenas itens/quantidades comprados após sucesso.
- Renderizar recibo pelo snapshot do pedido para que mudanças futuras no catálogo não alterem o histórico.

**Pronto quando:** compra completa, recusada, repetida e recuperada após timeout seguem regras corretas.

### 9. Integrar tempo real Socket.IO

- Criar conexão e ciclo de vida das subscriptions por sessão/rota; remover listeners ao desmontar/trocar sessão.
- Aplicar `nft.updated` em catálogo, detalhe e carrinho, respeitando versão e ignorando duplicatas/eventos antigos.
- Aplicar `order.updated` e tratar estados terminais.
- Ao reconectar, reconciliar recursos ativos por REST; cobrir refresh/reconexão de pedido pendente sem criar outra compra.
- Implementar o cenário de preço/estoque que muda durante o checkout e impede confirmação com cotação obsoleta.

**Pronto quando:** mudanças via evento chegam pelo socket client e mantêm a API/cache coerentes.

### 10. Fechar acessibilidade e responsividade

- Revisar teclado/foco, diálogos/drawers, labels e erros associados, alt text, contraste e feedback acessível.
- Conferir redução de movimento nos skeletons/animações, zoom e ausência de overflow horizontal.
- Revisar mobile, tablet e desktop em todas as telas, incluindo perfil, carteiras e confirmação sem frame mobile.

**Pronto quando:** fluxos podem ser operados por teclado e funcionam sem perda de conteúdo nos tamanhos exigidos.

**Andamento (16/11/2026):** segunda revisão mobile comparada com a cópia do Figma em leitura: Início, Detalhes do NFT, Carrinho, Pagamento, Login e Cadastro. Foram criadas as variantes `gradient`/`surface`/`cta` no `Button`, o token `surface-raised` e os assets exportados do Figma (banner, tab bar e marcas sociais). Detalhes e normalizações estão em `docs/FIGMA_VISUAL_ADJUSTMENTS.md` ("Revisão mobile 2"). Typecheck e lint passaram, e o E2E fechou em 12/12.

**Andamento (16/11/2026, revisão mobile 5):** busca, filtros (gaveta com coleção, preço e rede) e abas da Home mobile ligados a `GET /api/nfts`. O botão central da tab bar virou o leitor "Verificar NFT": QR do certificado ou link compartilhado, com `POST /api/scan/resolve` (contrato em `src/types/scan.contracts.ts`), câmera por `BarcodeDetector` e entrada manual como alternativa. O resultado acompanha `nft.updated` pelo cache do React Query. Detalhes em `docs/FIGMA_VISUAL_ADJUSTMENTS.md` ("Revisão mobile 5").

**Andamento (16/11/2026, revisão mobile 6):** `StatusAlert` padroniza os estados de erro, vazio e aviso em todas as páginas. A nova variante `width="mobile"` do `Button` aplica a regra de botão em largura total no mobile. Também entraram a rota `/activity` (histórico de compras, em desenvolvimento) e os filtros mobile em tela cheia. Detalhes em `docs/FIGMA_VISUAL_ADJUSTMENTS.md` ("Revisão mobile 6").

### 11. Criar cobertura Playwright

- Preparar fixtures isoladas por teste e comandos de reset/cenário no MSW.
- Cobrir os 12 grupos exigidos no desafio: catálogo/histórico; detalhe inexistente; conta/sessão; favoritos com rollback; carrinho/cupom/persistência; compra confirmada; falhas/idempotência; perfil/carteiras; alteração por socket; eventos antigos/duplicados/desconexão; acessibilidade; skeleton/erro/retry.
- Executar principais fluxos em Chromium desktop e mobile, controlar relógio/latência/eventos nos testes sensíveis a tempo.
- Adicionar regressão visual para início, detalhe, carrinho e pagamento com baselines versionadas.
- Guardar relatório HTML e traces das falhas.

**Pronto quando:** testes partem de estado isolado e observam UI e efeitos de REST/socket.

### 12. Auditar Lighthouse e otimizar

- Gerar build de produção com o cenário padrão de mocks e assets/fontes reais.
- Auditar início e detalhe em perfis mobile e desktop, três vezes por combinação.
- Reportar mediana para Performance, Accessibility, Best Practices e SEO; registrar LCP, CLS e TBT.
- Investigar resultados abaixo das metas (90/95/95/90) e salvar HTML/JSON, versões das ferramentas e condições de execução.

**Pronto quando:** configuração e resultados são reproduzíveis e desvios têm causa documentada.

### 13. Documentar, publicar e validar a entrega

- Completar `README.md` com instalação, `.env`, contas fictícias, comandos, cenários e reset.
- Completar `ARCHITECTURE.md` com contratos, sessão, carrinho, cache, socket/reconciliação, limitações e desvios do Figma.
- Confirmar checkout limpo com `npm ci`, build, tipos, lint e Playwright.
- Publicar o build em Vercel, Netlify ou Cloudflare Pages; configurar fallback de SPA para rotas diretas/refresh.
- Conferir a URL pública com mocks e fluxos em funcionamento e entregar URL do app e repositório.

**Pronto quando:** outra pessoa consegue abrir a URL pública e também reproduzir localmente a entrega a partir de um clone limpo.

## Prioridade se o prazo apertar

Não deixe o checkout e a prova de uso da stack para o último momento. A ordem de corte sugerida é: (1) contratos + MSW; (2) catálogo/detalhe/conta/carrinho/checkout funcionais; (3) eventos Socket.IO; (4) testes E2E dos principais fluxos; (5) deploy; (6) fechar estados restantes, acessibilidade, regressão visual e documentação/auditorias. Os itens eliminatórios do enunciado continuam precisando de evidência na entrega.

## Primeiros contratos e respostas de MSW

- `GET /api/session`: recupera a sessão persistida e válida, ou retorna estado não autenticado quando ausente/expirada.
- `GET /api/users/:userId`: retorna um dos colecionadores seed ou cadastrados ou `404 USER_NOT_FOUND`.
- `GET /api/orders/:orderId`: retorna um pedido fixture (um confirmado e um pendente) ou `404 ORDER_NOT_FOUND`.
- As três leituras usam `delay(350)` para tornar o estado de carregamento observável.

Os formatos ficam em `src/types/`; os dados de exemplo em `src/mocks/fixtures/`; handlers agrupados por domínio em `src/mocks/handlers/`. A autenticação usa estado persistido no navegador, derivação PBKDF2 para as senhas e token de sessão com expiração. O catálogo mantém estado mutável em memória e envia `nft.updated` por Socket.IO. O carrinho e os pedidos usam estado persistente do mock; perfil e carteiras continuam pendentes. Veja [MOCK_BACKEND.md](./MOCK_BACKEND.md) para rotas, credenciais e cenários disponíveis.

## Componentes shadcn/ui disponíveis

Os componentes instalados estão em `src/components/ui/`, prontos para importação e adaptação ao Figma: `accordion`, `alert`, `alert-dialog`, `avatar`, `badge`, `breadcrumb`, `button`, `card`, `checkbox`, `collapsible`, `command`, `dialog`, `dropdown-menu`, `empty`, `input`, `input-group`, `label`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toggle`, `toggle-group` e `tooltip`.

`TooltipProvider` e o `Toaster` do Sonner já estão no provider raiz. O Sidebar usa o hook `useIsMobile` em `src/hooks/`.

O painel lateral de filtros da Home está em `src/pages/home/components/home-filter-sidebar.tsx`; os grupos de filtro ficam em `home-catalog-filters.tsx`, reaproveitados pela tela de filtros mobile (`mobile-home-filters-dialog.tsx`). Ele segue o frame com Coleções, Faixa de preço em ETH e Rede, composto com `Card`, `Checkbox`, `Label`, `Slider`, `Separator` e `Button` do shadcn. A estrutura visual está conectada à Home e os filtros são encaminhados para o catálogo via query/API.

O layout compartilhado usa header responsivo com navegação desktop/mobile, menu mobile em `Sheet`, ações de busca/carrinho/entrada e footer. A rota raiz usa `AppLayout` para envolver o `Outlet` do TanStack Router. Autenticação, busca, carrinho/cotação, fluxo básico de pedido e atualização `order.updated` estão conectados. Favoritos persistidos por API e gravação de perfil/carteiras seguem pendentes; Playwright e Lighthouse foram executados, com a cobertura e os resultados documentados no README e em `docs/audits/lighthouse/`.
