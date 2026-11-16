export const learningArticles = [
  {
    slug: 'propriedade-de-nfts',
    image: '/assets/marketplace/ape-cream-coat.webp',
    date: '12 de setembro',
    readTime: 'Leitura de 4 min',
    title: 'Propriedade de NFTs',
    description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    content: [
      'Um NFT é um registro digital único que aponta para uma obra ou item colecionável. A rede mantém o histórico público de criação e transferências.',
      'Antes de comprar, confira o contrato, a coleção e a carteira que publicou o item. Esses dados ajudam a verificar a procedência e os direitos associados.',
      'A posse do token comprova o controle daquele ativo na carteira. Ela não substitui automaticamente direitos autorais ou licenças descritos pelo criador.',
    ],
  },
  {
    slug: 'artistas-digitais',
    image: '/assets/marketplace/ape-sunglasses.webp',
    date: '13 de setembro',
    readTime: 'Leitura de 2 min',
    title: 'Artistas digitais em destaque',
    description: 'Conheça criadores que estão moldando a arte digital.',
    content: [
      'A cena digital reúne artistas independentes, estúdios e comunidades com linguagens visuais próprias.',
      'Acompanhar o processo criativo, as coleções anteriores e os canais oficiais ajuda a entender a proposta de cada artista antes de colecionar.',
    ],
  },
  {
    slug: 'raridade-e-procedencia',
    image: '/assets/marketplace/ape-explorer.webp',
    date: '15 de setembro',
    readTime: 'Leitura de 5 min',
    title: 'Raridade e procedência',
    description: 'Entenda atributos e procedência de uma coleção.',
    content: [
      'Atributos descrevem características registradas para cada item. A raridade compara a frequência desses atributos dentro de uma coleção.',
      'A raridade é apenas um dos fatores de avaliação. Procedência, contexto, interesse da comunidade e utilidade também ajudam a contar a história de uma peça.',
    ],
  },
  {
    slug: 'proteger-carteira',
    image: '/assets/marketplace/ape-headphones.webp',
    date: '18 de setembro',
    readTime: 'Leitura de 3 min',
    title: 'Proteja sua carteira',
    description: 'Cuide da carteira e dos seus ativos digitais.',
    content: [
      'Guarde a frase de recuperação em local privado e offline. Nenhum suporte legítimo precisa que você a informe para resolver um problema.',
      'Confira endereços e permissões antes de assinar transações. Use canais oficiais e desconfie de mensagens com urgência ou promessas de recompensa.',
    ],
  },
  {
    slug: 'comunidades-de-colecionadores',
    image: '/assets/marketplace/ape-cream-coat.webp',
    date: '21 de setembro',
    readTime: 'Leitura de 3 min',
    title: 'Comunidades de colecionadores',
    description: 'Acompanhe projetos e converse com outras pessoas colecionadoras.',
    content: [
      'Comunidades ajudam a acompanhar o contexto de uma coleção, conhecer seus criadores e encontrar informações publicadas em canais oficiais.',
      'Antes de participar, confira as regras e os canais verificados do projeto. Nunca compartilhe sua frase de recuperação ou aprove uma transação que não compreenda.',
    ],
  },
  {
    slug: 'arte-generativa',
    image: '/assets/marketplace/ape-explorer.webp',
    date: '24 de setembro',
    readTime: 'Leitura de 4 min',
    title: 'Arte generativa',
    description: 'Veja como regras e escolhas artísticas criam novas imagens.',
    content: [
      'Na arte generativa, o artista define um conjunto de regras ou parâmetros que podem produzir diferentes resultados visuais. Cada peça preserva a linguagem do projeto e, ao mesmo tempo, ganha uma combinação própria.',
      'Observar os atributos, a curadoria e o processo de criação ajuda a entender o que diferencia uma coleção. A geração por código é uma ferramenta criativa, não uma medida automática de valor.',
    ],
  },
] as const

export type LearningArticle = (typeof learningArticles)[number]

// A Home mantém os quatro artigos que já compunham o Diário; os textos adicionais ampliam as recomendações internas.
export const homeLearningArticles = learningArticles.slice(0, 4)
