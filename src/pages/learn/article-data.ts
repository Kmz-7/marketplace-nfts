export const learningArticles = [
  {
    slug: 'propriedade-de-nfts',
    image: '/assets/marketplace/ape-cream-coat.png',
    date: '12 de setembro',
    readTime: 'Leitura de 4 min',
    title: 'Como funciona a propriedade de NFTs',
    description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    content: [
      'Um NFT é um registro digital único que aponta para uma obra ou item colecionável. A rede mantém o histórico público de criação e transferências.',
      'Antes de comprar, confira o contrato, a coleção e a carteira que publicou o item. Esses dados ajudam a verificar a procedência e os direitos associados.',
      'A posse do token comprova o controle daquele ativo na carteira. Ela não substitui automaticamente direitos autorais ou licenças descritos pelo criador.',
    ],
  },
  {
    slug: 'artistas-digitais',
    image: '/assets/marketplace/ape-sunglasses.png',
    date: '13 de setembro',
    readTime: 'Leitura de 2 min',
    title: '10 artistas digitais para acompanhar',
    description: 'Conheça criadores que moldam a cultura digital.',
    content: [
      'A cena digital reúne artistas independentes, estúdios e comunidades com linguagens visuais próprias.',
      'Acompanhar o processo criativo, as coleções anteriores e os canais oficiais ajuda a entender a proposta de cada artista antes de colecionar.',
    ],
  },
  {
    slug: 'raridade-e-procedencia',
    image: '/assets/marketplace/ape-explorer.png',
    date: '15 de setembro',
    readTime: 'Leitura de 5 min',
    title: 'Raridade, atributos e procedência',
    description: 'Entenda raridade, procedência, direitos autorais e utilidade.',
    content: [
      'Atributos descrevem características registradas para cada item. A raridade compara a frequência desses atributos dentro de uma coleção.',
      'A raridade é apenas um dos fatores de avaliação. Procedência, contexto, interesse da comunidade e utilidade também ajudam a contar a história de uma peça.',
    ],
  },
  {
    slug: 'proteger-carteira',
    image: '/assets/marketplace/ape-headphones.png',
    date: '18 de setembro',
    readTime: 'Leitura de 3 min',
    title: 'Como proteger sua carteira',
    description: 'Proteja sua carteira, seus ativos e sua identidade.',
    content: [
      'Guarde a frase de recuperação em local privado e offline. Nenhum suporte legítimo precisa que você a informe para resolver um problema.',
      'Confira endereços e permissões antes de assinar transações. Use canais oficiais e desconfie de mensagens com urgência ou promessas de recompensa.',
    ],
  },
] as const

export type LearningArticle = (typeof learningArticles)[number]
