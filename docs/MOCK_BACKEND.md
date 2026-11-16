# Backend simulado do marketplace

Este documento registra a primeira etapa de integração do frontend com uma API simulada, seguindo o [desafio frontend da Jungle Gaming](https://github.com/junglegaming/frontend-challenge). O MSW intercepta tráfego no navegador; não há servidor de produção nem conexão com blockchain, carteira ou gateway de pagamento.

## O que já funciona

- Cadastro, login, logout e consulta de sessão usam REST via Axios, TanStack Query e handlers MSW.
- Contas e sessões de demonstração persistem em `localStorage`; as senhas são guardadas somente como hash PBKDF2 com salt, nunca em texto claro.
- O cadastro valida nome, e-mail e tamanho da senha, impede e-mails duplicados e cria a sessão após sucesso. Login inválido, campos inválidos e conflitos retornam erros tipados.
- Perfil, carteiras, pagamento e confirmação exigem uma sessão; o destino solicitado é preservado ao entrar e retomado após autenticar.
- Sessões expiram após 30 minutos. O endpoint `POST /api/mock/session/expire` permite reproduzir expiração; `POST /api/mock/reset` restaura os usuários de demonstração e encerra a sessão.
- A Home carrega os NFTs pelo cliente Axios e pelo TanStack Query; os cards não usam mais a lista local da página.
- A página de detalhe consulta o NFT pelo endpoint REST e recebe uma tabela simulada de preços para cada edição disponível.
- O carrinho é sincronizado via REST e isolado por conta; os itens do visitante são incorporados à conta ao entrar.
- A API valida a edição e a quantidade disponível, cria cotações com subtotal, desconto, taxa de rede e total em ETH sem aritmética de ponto flutuante.
- O checkout cria pedidos com `Idempotency-Key`; após um timeout simulado, a repetição recupera o mesmo pedido. Pedidos pertencem à sessão que os criou.
- A tela de confirmação lê o snapshot do pedido pela API; somente pedidos `confirmed` mostram o recibo, enquanto `pending` e `declined` preservam os itens no carrinho.
- O catálogo devolve 18 NFTs de fixture, em páginas de 9, com busca, coleção, rede, preço mínimo/máximo e ordenação por mais recente ou preço.
- Há 20 perfis fictícios de colecionadores para avaliações, além das duas contas seed com credenciais de acesso. Todos usam avatares das artes de macacos locais.
- Cada NFT tem quatro avaliações seed recebidas por `GET /api/nfts/:nftId/reviews`, incluindo comentários longos para demonstrar a expansão do texto.
- Há endpoints REST para listar e consultar um NFT, atualizar preço/disponibilidade em modo de desenvolvimento e restaurar os dados.
- Os handlers REST e Socket.IO compartilham o mesmo estado em memória. Uma alteração via endpoint de mock incrementa a versão e envia `nft.updated` pelo Socket.IO; o cliente atualiza o detalhe, o catálogo e recarrega o carrinho/cotação.
- A conexão e a assinatura de eventos ficam em `src/services/socket.ts`; o provider atualiza o cache do detalhe e invalida o catálogo. Versões já recebidas são ignoradas quando repetidas ou antigas; os listeners são removidos ao desmontar o provider.
- Os estados de carregamento, erro e catálogo vazio da Home têm apresentação própria. O atraso padrão deixa o carregamento visível.

## Configuração

`npm run prepare:msw` gera `public/mockServiceWorker.js` e registra `public/` como diretório do worker no `package.json`. Quando `VITE_ENABLE_MOCKS=true`, o React monta para mostrar a interface imediatamente; chamadas Axios aguardam a inicialização do worker via `waitForMockWorker()`. No mobile, a importação do worker é postergada por 700 ms para reduzir trabalho concorrente com o primeiro paint; operações REST ficam aguardando o worker.

As variáveis estão em `.env.example`:

```env
VITE_ENABLE_MOCKS=true
VITE_API_BASE_URL=/api
# Vazio usa a origem atual para que o MSW intercepte o WebSocket também na Vercel.
VITE_SOCKET_URL=
```

Copie o arquivo para `.env` e execute `npm run dev`. Para build/preview com dados simulados, mantenha `VITE_ENABLE_MOCKS=true` no ambiente do build. O cliente e o handler Socket.IO compartilham `VITE_SOCKET_URL`. Deixe-o vazio para usar `window.location.origin`; assim o WebSocket permanece na origem da aplicação local ou publicada e pode ser interceptado pelo MSW. Defina o endereço apenas ao conectar um backend Socket.IO real.

O cliente Axios compartilhado fica em `src/lib/api-client.ts`. Serviços REST tipados ficam em `src/api/`; a conexão e os eventos Socket.IO ficam em `src/services/socket.ts`; contratos ficam em `src/types/`, fixtures em `src/mocks/fixtures/`, estado de mock em `src/mocks/state/` e handlers por domínio em `src/mocks/handlers/`. `src/mocks/browser.ts` registra handlers REST e WebSocket.

## Endpoints de conta e catálogo

| Método e caminho                    | Uso                                                                                                                    |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `POST /api/auth/register`           | Cria uma conta, recusa e-mail duplicado com `409 EMAIL_ALREADY_REGISTERED` e inicia uma sessão.                        |
| `POST /api/auth/login`              | Autentica com e-mail/senha; credenciais inválidas retornam `401 INVALID_CREDENTIALS`.                                  |
| `GET /api/session`                  | Recupera a sessão associada ao token Bearer persistido; retorna `authenticated: false` se estiver ausente ou expirada. |
| `POST /api/auth/logout`             | Encerra a sessão ativa.                                                                                                |
| `POST /api/mock/session/expire`     | Expira a sessão atual para desenvolvimento e demonstração.                                                             |
| `GET /api/users/:userId`            | Retorna um usuário cadastrado ou `404 USER_NOT_FOUND`.                                                                 |
| `GET /api/users`                    | Retorna os perfis seed, inclusive os vinte perfis fictícios usados pelas avaliações.                                   |
| `GET /api/nfts`                     | Lista paginada; aceita `q`, `page`, `pageSize`, `sort`, `collection`, `network`, `minPrice` e `maxPrice`.              |
| `GET /api/nfts/:nftId`              | Retorna um NFT ou `404 NFT_NOT_FOUND`.                                                                                 |
| `GET /api/nfts/:nftId/reviews`      | Retorna avaliações do NFT, nota média, contagem e dados públicos do perfil avaliador.                                  |
| `POST /api/mock/nfts/:nftId/update` | Altera `priceEth` e/ou `available` e emite `nft.updated`; preço inválido retorna `422`.                                |
| `POST /api/scan/resolve`            | Recebe `{ code }` lido pelo scanner mobile. Aceita `kurio:nft:<id>` (certificado, `verified: true`), link `.../nft?item=<id>` ou o id do NFT; código desconhecido retorna `404 SCAN_CODE_NOT_FOUND` e vazio `422`. |
| `POST /api/mock/scenario`           | Define `normal`, `slow`, `offline` ou `server-error` para as leituras de catálogo.                                     |
| `POST /api/mock/reset`              | Restaura fixtures e o cenário de rede `normal`.                                                                        |
| `GET /api/cart`                     | Retorna o carrinho da sessão ou do visitante e mescla itens de visitante após login.                                  |
| `PUT /api/cart`                     | Substitui os itens do carrinho; valida NFT, edição disponível e quantidade.                                           |
| `POST /api/cart/quote`              | Calcula cotação por rede; recebe `couponCode` e `network`.                                                             |
| `POST /api/orders`                  | Cria ou recupera pedido autenticado; exige `Idempotency-Key`, cotação válida, carteira e rede.                        |
| `GET /api/orders/:orderId`          | Busca um pedido da sessão; responde `401` sem login e `403` quando pertence a outra conta.                             |
| `POST /api/mock/commerce-scenario`  | Define cenário de pedido: `normal`, `payment-declined`, `payment-pending` ou `timeout-after-create`.                 |
| `POST /api/mock/orders/:orderId/status` | Finaliza um pedido pendente como `confirmed` ou `declined` e emite `order.updated` para a sessão proprietária.    |

As respostas usam contratos tipados de conta, sessão e NFT. Preços são strings decimais. Contas e sessão de demonstração persistem em `localStorage`; os dados do catálogo vivem na memória do worker. O endpoint de reset restaura os valores iniciais sem exigir refresh.

### Credenciais fictícias

Com `VITE_ENABLE_MOCKS=true`, use uma destas contas seed:

| E-mail              | Senha           |
| ------------------- | --------------- |
| `ada@example.test`  | `KurioDemo123!` |
| `caio@example.test` | `CaioDemo123!`  |

Contas criadas pelo formulário também persistem entre refreshes. O reset do mock restaura as contas seed e remove contas cadastradas durante a demonstração.

### Exercitar os mocks no navegador

Com o site aberto, os exemplos podem ser executados no console do navegador:

```js
await fetch('/api/mock/nfts/emerald-ape-042/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ priceEth: '1.35', available: true }),
})

await fetch('/api/mock/scenario', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ scenario: 'slow' }),
})

await fetch('/api/mock/reset', { method: 'POST' })
```

`slow` espera 1,8 s; `offline` retorna falha de rede e `server-error` retorna HTTP 503. Para variar a latência por requisição, envie o header `x-mock-delay` com milissegundos entre 0 e 5000. O cliente da Home usa o `AbortSignal` do TanStack Query para descartar requisições canceladas.

## Socket.IO e MSW

O cliente usa Socket.IO com transporte WebSocket explícito (`path: /socket.io/`). O MSW liga esse WebSocket ao formato de eventos Socket.IO com `@mswjs/socket.io-binding`; essa escolha é necessária porque o binding intercepta WebSocket, não o transporte HTTP long-polling. O handler é configurado em `src/mocks/handlers/socket.handlers.ts`; conexões ativas ficam em `src/mocks/socket/socket.server.ts`.

Os eventos implementados são:

```ts
{
  eventId: string
  version: number
  resource: 'nft'
  nft: NftContract
}
```

`order.updated` leva `eventId`, `version`, `resource: 'order'` e o snapshot do pedido. As conexões enviam o token de sessão no handshake; o mock só encaminha o evento de pedido para sockets com sessão válida do mesmo usuário. O cliente descarta versões repetidas/antigas, atualiza o pedido em cache e sincroniza o carrinho após confirmação. A confirmação consulta pedidos pendentes a cada três segundos para reconciliar estados após uma atualização perdida.

`POST /api/mock/nfts/:nftId/update` atualiza o estado compartilhado antes de emitir o evento. `src/services/socket.ts` entrega `nft.updated` ao `RealtimeProvider`, rejeita versões antigas/duplicadas, atualiza o cache do detalhe, invalida as listagens e recarrega o carrinho para que REST devolva os mesmos valores. A cotação é refeita quando preço ou disponibilidade mudam. Não há tratamento customizado de reconexão.

O binding não reproduz todas as funcionalidades de um servidor Socket.IO real (por exemplo, rooms e namespaces). A simulação usa conexão padrão e emite `nft.updated` para os clientes conectados; `order.updated` é filtrado pela sessão validada no mock, sem rooms do Socket.IO.

### Carrinho e pedidos

O estado da API simulada persiste em `localStorage` sob `kurio.mock.commerce.v1`; carrinhos são separados por `userId` e por `guest`. A chave de idempotência é escopada pelo usuário. O reset em `POST /api/mock/reset` também limpa carrinhos, pedidos e cenário comercial.

Os cupons de demonstração são `KURIO10` (10% de desconto), `EXPIRED10` (expirado) e qualquer outro valor não vazio (inválido). As taxas fixas do mock são `0.016 ETH` para Ethereum, `0.004 ETH` para Polygon e `0.002 ETH` para Solana. Esses valores servem apenas para demonstrar atualização de cotação; devem ser substituídos por valores definidos pelo serviço real.

O cenário `timeout-after-create` grava o pedido, devolve `504` na primeira resposta e retorna o mesmo pedido quando a mesma chave é reenviada. `payment-pending` e `payment-declined` não limpam o carrinho. O cenário padrão cria um pedido `confirmed` e a API limpa o carrinho após registrar o snapshot do recibo.

## Escopo ainda pendente

Favoritos, mutações de perfil e carteiras ainda não usam endpoints REST. O formulário de colecionador no checkout continua demonstrativo; nome/e-mail são pré-preenchidos pela sessão, mas não são enviados junto à criação do pedido. Os fluxos comerciais usam preços e taxas sintéticos e não se conectam a carteiras, blockchain ou gateway de pagamento.
