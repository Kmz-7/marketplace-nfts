# Arquitetura da entrega

Este documento registra contratos, decisões de UX e limites da aplicação para avaliação. REST e Socket.IO são simulados no navegador pelo MSW. O projeto não depende de serviço privado e não movimenta ativos, não conecta carteiras reais nem cobra pagamentos.

## Camadas e execução

```text
Páginas e componentes
  ├── TanStack Router: rotas e parâmetros de navegação
  ├── TanStack Query: consultas, cache e estados assíncronos
  └── src/api/ → Axios compartilhado → handlers MSW por domínio
                                  ├── fixtures e estado local
                                  └── WebSocket com protocolo Socket.IO
```

- Contratos de transporte ficam em `src/types/`; clientes REST em `src/api/`; eventos em `src/services/socket.ts`.
- Fixtures, stores e handlers ficam em `src/mocks/fixtures/`, `src/mocks/state/` e `src/mocks/handlers/`.
- `npm run dev:mocks` inicia Vite com `.env.mocks`. `VITE_ENABLE_MOCKS=true` também ativa MSW no build de demonstração.
- A aplicação monta antes do worker. Axios e Socket.IO esperam `waitForMockWorker()`; no mobile, a importação do worker é adiada em 700 ms para aliviar o primeiro paint. Handlers de perfil e scanner são chunks sob demanda; as avaliações ficam disponíveis no início porque acompanham a tela de detalhe.
- `vercel.json` encaminha rotas diretas da SPA para `index.html`.

## Contratos REST

Os contratos TypeScript são compartilhados entre clientes, handlers e interface. O guia [`docs/MOCK_BACKEND.md`](docs/MOCK_BACKEND.md) lista schemas, códigos de erro, cenários e exemplos de requisição.

| Recurso | Rotas implementadas | Comportamento principal |
| --- | --- | --- |
| Sessão | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/session`, `POST /api/auth/logout` | Cadastro, autenticação, restauração de sessão e saída. |
| Usuários | `GET /api/users`, `GET /api/users/:userId` | Perfis fictícios e dados do usuário autenticado/avaliador. |
| Perfil | `GET /api/profile`, `PUT /api/profile`, `PUT /api/profile/password` | Consulta e persiste dados de perfil e senha da conta autenticada. |
| NFTs | `GET /api/nfts`, `GET /api/nfts/:nftId`, `GET /api/nfts/:nftId/reviews` | Busca, filtros, ordenação, paginação, detalhe e avaliações. |
| Carrinho e cotação | `GET /api/cart`, `PUT /api/cart`, `POST /api/cart/quote` | Carrinho por visitante/conta, validação de edição e total por rede/cupom. |
| Pedidos | `POST /api/orders`, `GET /api/orders/:orderId` | Criação idempotente, consulta autorizada e snapshot para recibo. |
| Scanner | `POST /api/scan/resolve` | Resolve um código de demonstração para um NFT. |
| Cenários de mock | `/api/mock/*` | Reset, sessão expirada, falhas de rede, preço/disponibilidade, cenário e estado de pedido. |

Favoritos e operações CRUD de carteiras ainda não possuem endpoints REST; avatar também não é editável. O formulário de perfil e a troca de senha já persistem pela API simulada. O formulário de colecionador do checkout continua demonstrativo e seus dados não são enviados junto à criação do pedido.

## Sessão, isolamento e carrinho

- O token de demonstração fica no `localStorage`, é enviado como Bearer token e expira em 30 minutos. Senhas de contas mock usam PBKDF2 com salt; não são armazenadas em texto claro.
- O store de mock separa carrinhos por `userId` e por `guest`. Ao autenticar, os itens do visitante são mesclados ao carrinho da conta; `GET /api/cart` é a fonte de verdade após refresh e mutations.
- Quantidades são inteiras e nunca menores que um. Disponibilidade é validada por NFT e edição. ETH trafega como string decimal e os cálculos usam unidades inteiras (`BigInt`).
- A cotação inclui subtotal, desconto, taxa e total. `POST /api/orders` exige `Idempotency-Key` e referência a uma cotação atual. Reutilizar a chave com outro conteúdo retorna conflito; após timeout, a mesma tentativa recupera o pedido existente.
- O recibo usa o snapshot persistido do pedido. Confirmação limpa as quantidades compradas; recusa e pendência preservam o carrinho.
- `POST /api/mock/reset` restaura contas seed, catálogo, carrinho, pedidos e cenários para o estado conhecido.

## Cache e atualização

O `QueryClient` usa `staleTime: 30_000`, uma tentativa de repetição e não busca novamente ao recuperar foco. Chaves de catálogo/detalhe refletem os parâmetros consultados. Listagens e avaliações usam `AbortSignal` quando a requisição pode ser cancelada.

Eventos de NFT substituem o detalhe no cache, invalidam catálogo e recarregam o carrinho. Preço e disponibilidade fazem parte da chave derivada da cotação, então a cotação é refeita quando o carrinho recebe novos valores. Eventos de pedido atualizam o pedido e sincronizam o carrinho somente para o usuário proprietário.

## Eventos Socket.IO e reconciliação

O payload carrega identidade estável, versão monotônica, recurso afetado e snapshot tipado:

```ts
type NftUpdatedEvent = {
  eventId: string
  version: number
  resource: 'nft'
  nft: NftContract
}

type OrderUpdatedEvent = {
  eventId: string
  version: number
  resource: 'order'
  order: OrderContract
}
```

`src/services/socket.ts` mantém conexão, handlers e descarte dos listeners. O cenário REST atualiza o mesmo store usado pelo evento; o teste E2E de preço usa `socket.io-client` e valida o efeito visível no detalhe e no carrinho. O cliente ignora versões repetidas ou antigas. `order.updated` é filtrado pelo token associado à conta proprietária; pedidos `confirmed` e `declined` são estados terminais.

O detalhe do transporte é `VITE_SOCKET_URL` vazio, que usa a origem do site e o caminho `/socket.io/`; assim o MSW intercepta em HTTP local e HTTPS publicado. `@mswjs/socket.io-binding` mocka o protocolo Socket.IO sobre WebSocket. Não oferece rooms/namespaces completos. A aplicação não define política própria de reconexão; a confirmação recupera pedido pendente por consulta REST periódica e após refresh, mas não existe sincronização genérica de todos os recursos no evento de reconexão.

## Cenários, testes e auditorias

- `docs/MOCK_BACKEND.md` documenta seleção de cenários para latência, falhas, cupom, indisponibilidade, timeout/idempotência, pagamento e reset.
- `e2e/marketplace.spec.ts` verifica doze fluxos funcionais em Chromium desktop e mobile, incluindo Socket.IO para detalhe e carrinho, perfil autenticado, overflow em 768 px, filtro mobile sob demanda e prévia ampliada no desktop. A última execução teve 30 testes aprovados e dois ignorados por viewport.
- `e2e/visual-regression.spec.ts` compara início, detalhe, carrinho e pagamento com oito baselines PNG versionados em `e2e/visual-regression.spec.ts-snapshots/`. O relatório HTML da execução está em `docs/audits/playwright/`; traces de falhas são retidos em `test-results/`.
- Os cenários E2E restantes do enunciado ainda não estão completos: busca/filtros/histórico, ciclo completo de sessão, rollback de favorito, isolamento de perfil/carteiras, disputa de eventos, retomada por reconexão, navegação por teclado e recuperação de carregamento/erro. A cobertura atual não equivale aos doze grupos funcionais enumerados no desafio.
- `lighthouserc.desktop.json` e `lighthouserc.mobile.json` coletam três medições por rota em Home e detalhe, definem os limites do desafio e gravam JSON/HTML versionados em `docs/audits/lighthouse/`.

## Decisões visuais e limitações

- O Figma define identidade visual e composição. Diferenças intencionais entre desktop e mobile foram preservadas; ajustes pequenos de consistência estão justificados no [`docs/FIGMA_VISUAL_ADJUSTMENTS.md`](docs/FIGMA_VISUAL_ADJUSTMENTS.md).
- Favoritos ficam no armazenamento local separado por conta; não há mutation REST otimista com rollback.
- Perfil e carteiras são telas visuais sem gravação no mock. Os dados de colecionador são pré-preenchidos no checkout, mas não fazem parte do contrato do pedido.
- A rota extra de atividade tem estado demonstrativo; atividade não está entre as telas obrigatórias do enunciado.
- Nomes, preços por edição, taxas e referências de transação são dados de demonstração.

Esses limites também aparecem no README e no guia de backend mock; a demonstração não deve ser apresentada como backend de produção.
