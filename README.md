# Kurio — NFT Marketplace

Marketplace responsivo de NFTs desenvolvido como entrega do [frontend challenge da Jungle Gaming](https://github.com/junglegaming/frontend-challenge). A aplicação demonstra descoberta de itens, detalhes e avaliações, autenticação simulada, carrinho, cotação e checkout.

**Repositório:** [Kmz-7/marketplace-nfts](https://github.com/Kmz-7/marketplace-nfts)<br>
**URL da demonstração:** [marketplace-nfts-one.vercel.app](https://marketplace-nfts-one.vercel.app/)

> Estado verificado em 16/11/2026: a Home pública responde HTTP 200, mas `/nft?item=emerald-ape-042` e `/cart` respondem HTTP 404. O rewrite de SPA está preparado em `vercel.json`; envie esta atualização e publique um novo deploy, depois confira o acesso direto e o refresh dessas rotas.

## Funcionalidades

- Catálogo com busca, coleções, redes, faixa de preço, ordenação e paginação.
- Página de detalhes consultada pela API simulada, opções de edição com preços variáveis, galeria e avaliações de colecionadores.
- Cadastro, login, logout e sessão demonstrativos, com retomada do fluxo após autenticação.
- Carrinho de visitante e de usuário, quantidade, remoção, cupom e cotação por rede.
- Checkout com escolha de carteira/rede, pedido idempotente, estados confirmado/pendente/recusado e recibo baseado no pedido.
- Eventos `nft.updated` e `order.updated` simulados com Socket.IO e MSW.
- Estados de carregamento, erro e ausência de resultados; interface adaptada para desktop e mobile.

## Tecnologias

React, TypeScript, Vite, TanStack Router, TanStack Query, Axios, Tailwind CSS, shadcn/ui, MSW, Socket.IO, Playwright e Lighthouse CI.

## Executar localmente

Requisitos: Node.js 22.x, npm e Git.

```bash
git clone https://github.com/Kmz-7/marketplace-nfts.git
cd marketplace-nfts
npm ci
npm run dev:mocks
```

O Vite mostra o endereço local no terminal (normalmente `http://localhost:5173`). `npm run dev:mocks` usa `.env.mocks` e inicia REST/WebSocket simulados sem exigir API, servidor Socket.IO, carteira ou gateway real. Use `.env.example` como referência para personalizar variáveis locais:

| Variável | Padrão | Uso |
| --- | --- | --- |
| `VITE_ENABLE_MOCKS` | `true` | Liga os handlers REST e Socket.IO simulados no navegador. |
| `VITE_API_BASE_URL` | `/api` | Prefixo do cliente HTTP. |
| `VITE_SOCKET_URL` | origem atual da página | Deixe vazio para o WebSocket simulado pelo MSW; preencha apenas quando usar um servidor Socket.IO real. |

O worker `public/mockServiceWorker.js` já está versionado. Para regenerá-lo após atualizar o MSW, execute `npm run prepare:msw`.

## Contas de demonstração

| E-mail | Senha |
| --- | --- |
| `ada@example.test` | `KurioDemo123!` |
| `caio@example.test` | `CaioDemo123!` |

As credenciais são fictícias. O pagamento, as carteiras e os dados do catálogo são simulações de frontend; nenhuma transação real é criada. Para restaurar fixtures, contas e pedidos, abra o site local e execute no console do navegador:

```js
await fetch('/api/mock/reset', { method: 'POST' })
```

## Verificações

```bash
npm run typecheck        # TypeScript
npm run lint             # ESLint
npm run dev:mocks        # Vite com handlers REST e Socket.IO do MSW
npm run build            # build de produção
npm run preview          # serve o build local em modo de preview
npx playwright install chromium # reutilizado também nas auditorias LHCI
npm run test:e2e         # Playwright: Chromium desktop e mobile
npm run audit:lighthouse        # Lighthouse CI: Home e detalhe, 3 medições desktop
npm run audit:lighthouse:mobile # Lighthouse CI: Home e detalhe, 3 medições mobile
```

O Playwright executa 32 ocorrências (12 fluxos funcionais e quatro regressões visuais, em Chromium desktop e mobile): 30 passam e dois são ignorados por viewport (filtros mobile e prévia desktop). Os fluxos exercitam avaliações e expansão de texto, NFT inexistente, atualização de preço via Socket.IO no detalhe e carrinho, quantidades, cupom, login durante checkout, recuperação de timeout, recusa de pagamento, autenticação para favoritar, leitura/edição do perfil, overflow nas quatro telas em 768 px, filtros mobile sob demanda e prévia ampliada desktop. As capturas visuais comparam 390 px (mobile) e 1440 px (desktop); o teste responsivo adicional verifica 768 px. Os oito baselines PNG ficam versionados em `e2e/visual-regression.spec.ts-snapshots/`. O relatório HTML executável fica versionado em `docs/audits/playwright/`; em falhas, o trace é retido em `test-results/`. Os relatórios Lighthouse ficam em `docs/audits/lighthouse/`.

Para a auditoria Lighthouse, gere primeiro o build (`npm run build`). Cada comando inicia e encerra seu preview; as configurações desktop e mobile auditam a Home e `/nft?item=emerald-ape-042` três vezes cada e validam os alvos do desafio: performance ≥90, acessibilidade ≥95, boas práticas ≥95 e SEO ≥90.

### Cenários simulados e reset

Com o site aberto, execute no console do navegador. O cenário de rede controla as leituras do catálogo:

```js
await fetch('/api/mock/scenario', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ scenario: 'slow' }), // normal | slow | offline | server-error
})
```

Para reproduzir recusa ou timeout de pagamento, selecione o cenário antes de iniciar a compra. Em `timeout-after-create`, uma repetição recupera o mesmo pedido com a chave de idempotência:

```js
await fetch('/api/mock/commerce-scenario', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ scenario: 'payment-declined' }), // normal | payment-declined | payment-pending | timeout-after-create
})
```

Para demonstrar preço alterado e evento `nft.updated`, envie `POST /api/mock/nfts/emerald-ape-042/update` com `{ priceEth: '1.35' }`. Para limpar contas criadas, sessão, cenários, catálogo alterado, carrinho e pedidos:

```js
await fetch('/api/mock/reset', { method: 'POST' })
```

Mais detalhes dos contratos e respostas estão em [`docs/MOCK_BACKEND.md`](docs/MOCK_BACKEND.md).

### Implantação na Vercel

Importe o repositório como projeto Vite, com `npm run build` e diretório de saída `dist`. Configure `VITE_ENABLE_MOCKS=true` nos ambientes Preview e Production **antes do build**; as variáveis `VITE_*` são incorporadas ao bundle. Deixe `VITE_SOCKET_URL` vazio para usar a origem do deploy com o MSW. O [`vercel.json`](vercel.json) encaminha rotas da SPA para `index.html`, permitindo abrir e atualizar diretamente `/nft?item=emerald-ape-042`, `/cart`, `/profile` e `/wallets`.

Após o deploy, valide a URL pública em janela anônima: Home, detalhe com acesso direto e refresh, cadastro/login, carrinho, checkout simulado e uma atualização de preço via `nft.updated`. O deploy só está pronto quando a versão publicada corresponder ao commit enviado e permanecer acessível.

### Resultado local desta revisão — 16/11/2026

Cada célula é a mediana de três auditorias por página e perfil. A meta do desafio é Performance ≥90, Acessibilidade ≥95, Boas práticas ≥95 e SEO ≥90.

| Perfil | Página | Performance | Acessibilidade | Boas práticas | SEO | LCP mediano | CLS | TBT mediano |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Desktop | Início | 98 | 100 | 100 | 100 | 1,19 s | 0,0004 | 0 ms |
| Desktop | Detalhes do NFT | 99 | 100 | 100 | 100 | 0,90 s | 0 | 0 ms |
| Mobile | Início | 86 | 98 | 100 | 100 | 4,14 s | 0 | 90 ms |
| Mobile | Detalhes do NFT | 88 | 100 | 100 | 100 | 3,90 s | 0 | 113 ms |

Os resultados são medianas de três execuções por página/perfil no build de produção com MSW, sem desativar imagens, fontes ou funcionalidades. O Lighthouse mobile usa throttling simulado e o Chromium headless do ambiente local. Home (86) e detalhe (88) continuam abaixo da meta de performance (90); o Lighthouse estima 121 KiB de JavaScript não utilizado na Home e 119 KiB no detalhe, concentrados no cliente MSW e no bundle inicial. Handlers não críticos de perfil e scanner foram separados para carregamento sob demanda, mas isso não reduziu a estimativa reportada nem fez as páginas alcançarem a meta. O comando mobile retorna falha até a pontuação passar de 90. Versões, ambiente, diagnóstico e relatórios HTML/JSON estão em [`docs/audits/lighthouse/README.md`](docs/audits/lighthouse/README.md).

## Estrutura e documentação

- `src/api/`: clientes REST tipados.
- `src/mocks/fixtures/`, `src/mocks/handlers/`, `src/mocks/state/`: dados, endpoints e estado simulados.
- `src/services/socket.ts`: conexão e assinatura dos eventos em tempo real.
- `src/pages/`: páginas e componentes da experiência.
- `e2e/`: fluxos automatizados de navegador.
- [`docs/MOCK_BACKEND.md`](docs/MOCK_BACKEND.md): endpoints, cenários, cupons, contas e limites da simulação.
- [`docs/PROJECT.md`](docs/PROJECT.md): arquitetura e estado do projeto.
- [`ARCHITECTURE.md`](ARCHITECTURE.md): contratos, sessão, carrinho, cache, Socket.IO, reconciliação e limitações.
- [`docs/FIGMA_VISUAL_ADJUSTMENTS.md`](docs/FIGMA_VISUAL_ADJUSTMENTS.md): decisões de consistência visual em relação às referências do Figma.

## Escopo conhecido

Esta entrega cobre os principais fluxos executáveis do marketplace, mas não substitui um backend de produção. Favoritos e operações CRUD de carteiras ainda não usam endpoints REST; avatar também não é editável. Perfil e senha já são consultados e persistidos pela API simulada. O formulário de perfil no checkout continua demonstrativo e não é enviado no pedido. A cobertura automatizada atual é uma suíte de fluxo essencial, não os doze grupos completos do desafio: faltam cenários E2E dedicados para histórico/URL de filtros, rollback de favoritos, isolamento de perfil/carteiras, atualização e reconciliação via socket, reconexão e regressões visuais. Esses limites estão detalhados em [`docs/MOCK_BACKEND.md`](docs/MOCK_BACKEND.md).

Consulte o [enunciado oficial](https://github.com/junglegaming/frontend-challenge) para os critérios completos do desafio.
