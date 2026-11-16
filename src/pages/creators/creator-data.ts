export const creatorFeatures = [
  {
    id: 'genesis',
    image: '/assets/marketplace/ape-sunglasses.webp',
    imageAlt: 'Macaco com óculos de sol e jaqueta verde',
    title: 'Lançamentos gênesis de edição limitada',
    description: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
    author: 'Ren Aoki',
    biography:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cada criação nasce de uma pesquisa cuidadosa sobre cor, movimento e identidade digital. O processo combina experimentação artística com histórias pensadas para quem gosta de colecionar.',
  },
  {
    id: 'selected-art',
    image: '/assets/marketplace/ape-cream-coat.webp',
    imageAlt: 'Macaco com casaco claro',
    title: 'Arte digital selecionada e muito mais',
    description: 'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura digital.',
    author: 'Marina Kato',
    biography:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A artista transforma referências cotidianas em universos visuais próprios, aproximando tecnologia, memória e cultura. Suas coleções convidam cada pessoa a descobrir novos detalhes a cada visita.',
  },
] as const

export type CreatorFeature = (typeof creatorFeatures)[number]
