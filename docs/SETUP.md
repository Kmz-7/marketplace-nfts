# Setup e dependências

> Guia de requisitos, instalação e comandos. O estado atual e o cronograma ficam em [PROJECT.md](./PROJECT.md).

## Requisitos

- Node.js 22 ou superior (ambiente atual: Node 22).
- npm 10 ou superior.
- Git.

## Instalação do projeto

Depois de clonar o repositório:

```bash
npm install
cp .env.example .env
npm run dev
```

O `package-lock.json` registra as versões resolvidas. Em uma instalação limpa ou CI, prefira `npm ci` para instalar exatamente o lockfile.

## Bibliotecas e comandos usados

### Aplicação e dados

```bash
npm install react react-dom
npm install @tanstack/react-router @tanstack/react-query
npm install axios socket.io-client
```

- **React + TypeScript + Vite:** interface, tipagem estática e servidor/build de desenvolvimento.
- **TanStack Router:** rotas, URL de busca e navegação entre telas; o plugin de rotas está em `vite.config.ts`.
- **TanStack Query:** consultas REST, mutations, cache, invalidação e sincronização.
- **Axios:** cliente HTTP que será usado pela camada de serviços REST.
- **Socket.IO Client:** assinatura de eventos `nft.updated` e `order.updated` em `src/services/socket.ts`.

As ferramentas de compilação e tipos foram adicionadas como dependências de desenvolvimento:

```bash
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom @tanstack/router-plugin
```

### Estilos e componentes

```bash
npm install -D tailwindcss@^4 @tailwindcss/vite
npm install clsx tailwind-merge class-variance-authority lucide-react
npm install -D shadcn
npx shadcn@latest init -d
```

- **Tailwind CSS 4 + Vite plugin:** utilitários de estilo e responsividade; o processamento está em `vite.config.ts` e os tokens em `src/styles.css`.
- **shadcn/ui:** CLI copia componentes acessíveis para dentro do projeto; os componentes podem ser adaptados ao Figma.
- `clsx`, `tailwind-merge` e `class-variance-authority` apoiam composição de classes e variantes.
- **Lucide:** ícones.

### API simulada

```bash
npm install -D msw@^2.15.0 @mswjs/socket.io-binding
npx msw init public/ --save
```

**MSW** intercepta requisições no nível da rede para simular REST sem espalhar dados falsos pelos componentes. O worker inicia antes do React quando `VITE_ENABLE_MOCKS=true`, tanto no desenvolvimento quanto no build de demonstração. Catálogo, serviço Axios, fixtures, handlers e Socket.IO estão descritos em [MOCK_BACKEND.md](./MOCK_BACKEND.md). O binding `@mswjs/socket.io-binding` adapta mensagens WebSocket ao protocolo de eventos Socket.IO usado pelo cliente.

> `@mswjs/socket.io-binding@0.2` exige MSW 2 (`peerDependency ^2.10.2`); por isso a versão foi fixada na linha `2.x`.

### Testes de navegador

```bash
npm install -D @playwright/test
npx playwright install chromium
```

- **Playwright** abre um Chromium controlado para validar fluxos completos e tamanhos de tela.
- Configuração em `playwright.config.ts`; testes em `e2e/` rodam em Chromium desktop e mobile.
- `trace` e relatório HTML ajudam a investigar falhas.

### Auditoria de qualidade

```bash
npm install -D @lhci/cli
```

**Lighthouse CI** mede performance, acessibilidade, boas práticas e SEO no build de produção. As configurações desktop e mobile (`lighthouserc.desktop.json` e `lighthouserc.mobile.json`) auditam Home e detalhe três vezes por perfil. Os relatórios entregáveis HTML/JSON ficam versionados em `docs/audits/lighthouse/`; `.lighthouseci/` é usado internamente pelo LHCI durante a execução.

## Comandos do projeto

```bash
npm run dev:mocks           # Vite com MSW REST e Socket.IO ativo
npm run dev                 # servidor de desenvolvimento
npm run build               # verificação TypeScript e build otimizado
npm run preview              # serve o build localmente
npm run typecheck            # apenas verificação de tipos
npm run lint                 # ESLint
npm run test:e2e             # testes E2E Chromium
npm run test:e2e:ui          # interface interativa do Playwright
npm run test:e2e:report      # abre o relatório HTML mais recente
npm run audit:lighthouse     # Lighthouse desktop
npm run audit:lighthouse:mobile # Lighthouse mobile
```

### Componentes shadcn/ui instalados

O conjunto adicionado para reduzir instalações durante a implementação inclui cards, inputs/formulários, tabs, badges, avatar, diálogos/drawers, menu de comandos/navegação, sidebar, skeleton/empty/progress, toast, tabela/paginação e componentes auxiliares. Os arquivos ficam em `src/components/ui/`. Novos componentes podem ser adicionados com `npx shadcn@latest add <componente>`.
