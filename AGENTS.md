# Regras do projeto

## Colaboração e autoria

- Priorize as instruções atuais do usuário e preserve alterações existentes no projeto.
- O usuário mantém a autoria da arquitetura de estados, do fluxo de dados, das regras de negócio e da integração Socket.IO, incluindo reconexão e eventos. Não implemente essas partes sem solicitação explícita.
- Ajude com estrutura inicial, contratos e fixtures, estilização repetitiva, componentes visuais e tipagem quando solicitado. Explique alterações de forma que o usuário consiga revisá-las.
- Adicione comentários curtos no código quando registrar uma divergência visual observada no Figma e a decisão adotada para corrigi-la. Para outras explicações, prefira a documentação.

## Arquitetura, Nomenclatura e Reaproveitamento

- Nomeie arquivos e componentes em inglês. Use PascalCase para componentes React exportados e kebab-case para arquivos; mantenha `__root.tsx` e os tokens exigidos pelo roteador. Quando um nome de arquivo em inglês alterar uma URL pública existente, preserve a URL antiga por redirecionamento.
- **Organização por domínio/função:** Nomeie arquivos e componentes de forma descritiva e padronizada (ex: `UserFilterInput.tsx`, `OrderSummaryCard.tsx`). Mantenha componentes genéricos de UI em `src/components/ui/` e componentes compostos/de domínio organizados em pastas específicas da feature ou em `src/components/`.
- **Reaproveitamento obrigatório:** Antes de criar um novo componente, inspecione `src/components/` para reutilizar estruturas existentes. Se uma nova página exigir uma variação visual de um componente já existente, adicione uma prop ou variante (`variant`) nele em vez de duplicar código.

## Modularização e Responsabilidade por Página

- **Modularização e Single Responsibility Principle (SRP):** Não crie arquivos de página monolíticos ou excessivamente longos. O arquivo `page.tsx` deve atuar exclusivamente como container de layout, orquestração e roteamento de alto nível, contendo apenas o esqueleto estrutural da tela.
- **Co-location por feature ou página:** Extraia subcomponentes específicos de uma tela (como formulários locais, tabelas, blocos de paginação e cards internos) para arquivos próprios dentro de uma pasta dedicada à feature ou página, por exemplo `src/pages/marketplace/<feature>/components/`.
- **Composição de componentes:** Componha cada tela a partir de componentes menores e especializados. Mantenha regras de negócio complexas, funções auxiliares e chamadas externas específicas em módulos próprios, como `hooks/`, `utils/` ou arquivos de suporte dedicados; não concentre essas responsabilidades no arquivo principal da página.

## Interface, Tokens e Estilização (`src/styles.css`)

- **Proibição de valores arbitrários:** Nunca use valores arbitrários no Tailwind para cores ou tamanhos de fonte (ex: proibido `text-[#...]`, `bg-[#...]`, `border-[#...]`, `text-[13px]`). Utilize exclusivamente os tokens semânticos mapeados em `src/styles.css`.
- **Tokens e Paleta de Cores:** Centralize qualquer nova variável de cor, borda ou superfície em `src/styles.css` antes de aplicá-la nos componentes. Respeite os tokens base do projeto (`primary` #D28A4C, `background` #140D0A, `secondary` #241612, `muted-foreground` #CFB28C, `link` #E89B55 e `surface-dark` #38220F) e mantenha a tipografia restrita a no máximo **6 variações de cor de texto** definidas no tema.
- **Escala Tipográfica:** Use `Roboto Mono` como fonte padrão e somente `text-xs`, `text-sm`, `text-md`, `text-lg` e `text-xl`. `text-md` representa 16 px. Títulos usam `lg`, descrições `md` e subtítulos/metadados visualmente pequenos `xs`. Preserve como exceções a tipografia do banner principal da Home e o logotipo KURIO das telas de acesso (classe `.brand-logo`, 32 px), conforme a orientação do usuário. Abaixo de `md` (767 px), `src/styles.css` reduz toda a escala um degrau (xl→18, lg→16, md→14, sm→12, xs→11 px); não compense isso com classes `max-md:text-*`.
- **Semântica de cores:** Prefira `primary`, `secondary`, `muted`, `muted-foreground`, `foreground` e `background`. Use tokens adicionais de borda, link ou estado apenas quando a diferença semântica ou o contraste exigir.
- **Consistência visual:** Padronize blocos verticais relacionados com `space-y-3` quando adequado, use `rounded-lg` nos botões (única exceção: `size="fab"`, o botão de scan circular da tab bar mobile) e mantenha ícones de ação em `size-4`.
- **Largura dos botões no mobile:** abaixo de `md`, um botão sozinho na linha ocupa a largura toda (`<Button width="mobile">`). Ele só mantém a largura do conteúdo quando há outro elemento ao lado (ex.: "Limpar" + "Ver resultados", quantidade + carrinho) ou quando é a ação compacta de um `StatusAlert`.
- **Estados de erro, vazio e aviso:** use sempre `StatusAlert` (`src/components/status-alert.tsx`), com `tone="error" | "empty" | "info"`, título opcional (`headingLevel="h1"` quando substitui o conteúdo da página) e ação via `StatusAlertAction`. Não monte cards, parágrafos ou `Alert` avulsos para esses estados. Para imagens, use as classes de papel `image-banner`, `image-standard` e `image-thumbnail`; as miniaturas do carrinho, pagamento e confirmação devem compartilhar o mesmo tamanho.

## Componentes Shadcn/UI e Semântica

- **Uso estrito de Shadcn/UI:** Todo controle de formulário e ação nas páginas deve usar os componentes de `src/components/ui/` (`Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Button`, `NavigationMenu`/`NavigationMenuLink`). É estritamente proibido usar `<input>`, `<textarea>`, `<select>`, `<button>` ou `<a>` nativos diretamente nas páginas.
- **Como personalizar componentes por página (Regra Crítica):** Quando o Figma apresentar um componente (como um `Input` com ou sem borda/fundo) diferente do padrão global:
  1. **Nunca** substitua o componente shadcn por HTML nativo estilizado na linha.
  2. **Nunca** entupa a chamada do componente na página com dezenas de classes Tailwind sobrescrevendo o visual base.
  3. **Sempre** estenda o componente original em `src/components/ui/` adicionando variantes oficiais (ex: via `cva` / `cn()`, criando props como `variant="ghost"` ou `variant="bordered"`) ou crie uma classe utilitária padronizada em `src/styles.css`.
- **Composição Base UI:** Use `render` quando for necessário compor um componente Base UI com um link do TanStack Router ou uma âncora.
- **Uso de Card:** Use `Card` (`CardHeader`, `CardContent`, `CardFooter`) apenas para elementos que representem visualmente um cartão ou painel com superfície. Não use `Card` como substituto de wrappers de layout (`grid`/`flex`) nem use `<div>` genéricas para simular cartões.
- **HTML Semântico e Acessibilidade:** Use `main`, `section`, `nav`, `article`, `header`, listas e títulos para estrutura. Preserve acessibilidade, foco por teclado e nomes acessíveis.
- **Ícones:** Use ícones Lucide. Avise o usuário quando não houver um ícone equivalente para reproduzir o Figma.

## Processo de Leitura do Figma e Responsividade

- Consulte o Figma somente em modo de leitura; não edite o arquivo compartilhado. Considere as descrições, dimensões, cores e estados dos componentes e informe quando algum detalhe não puder ser confirmado.
- Preserve a ideia visual, a hierarquia e a composição do Figma em desktop e mobile. Se instâncias do mesmo componente tiverem padding, margem, alinhamento ou dimensões claramente inconsistentes, normalize o padrão com um ajuste pequeno que preserve a aparência geral e a funcionalidade. Não trate diferenças intencionais entre desktop e mobile como erros.
- Prefira as dimensões padrão dos componentes shadcn/ui instalados. Personalize principalmente cores, fundos, bordas e tipografia; ajuste dimensões apenas quando necessário para resolver uma inconsistência clara ou manter a composição responsiva.
- Registre no próprio trecho de código as correções de inconsistências visuais, com o problema observado no Figma. Documente em `docs/FIGMA_VISUAL_ADJUSTMENTS.md` o contexto, o critério adotado, a justificativa e as questões que permanecerem ambíguas. Não apresente aproximações como cópias exatas.
- Confira os layouts nas larguras de 390, 768 e 1440 pixels quando relevante.
- Mantenha o cabeçalho `sticky`, com fundo translúcido, e o item ativo da navegação com borda inferior `primary`.

## Dados e documentação

- Mantenha contratos compartilhados em `src/types/`, fixtures e factories em `src/mocks/fixtures/`, handlers MSW por domínio em `src/mocks/handlers/` e o setup do worker em `src/mocks/browser.ts`.
- Mantenha os handlers responsáveis por simular a rede e use `delay` quando necessário para permitir o desenvolvimento dos estados de carregamento.
- Documente requisitos, instalação, configuração e comandos em `docs/SETUP.md`; registre decisões, andamento e cronograma em `docs/PROJECT.md`. Organize o material para futura migração ao README.
- Ao instalar bibliotecas ou componentes, registre os comandos relevantes e explique a finalidade da configuração.

## Stack Avançada, Testes e Qualidade

- **Socket.IO (`src/services/socket.ts`):** Mantenha a conexão e o gerenciamento de eventos em tempo real isolados em módulo próprio. Respeite os eventos definidos nos contratos sem inventar regras de reconexão arbitrárias.
- **MSW (Mock Service Worker):** Utilize handlers centralizados em `src/mocks/handlers/` para simular respostas REST da aplicação, empregando delays controlados para testar estados de carregamento.
- **Playwright:** Ao estruturar testes E2E, priorize seletores acessíveis (`getByRole`, `getByLabel`) e valide os fluxos críticos de navegação e componentes.
- **Lighthouse / Acessibilidade:** Desenvolva com foco estrito em boas práticas de performance e acessibilidade, garantindo elementos semânticos corretos, textos alternativos em imagens e suporte a navegação por teclado.
