export const creatorFeatures = [
  {
    id: 'genesis',
    image: '/assets/marketplace/ape-sunglasses.png',
    imageAlt: 'Macaco com óculos de sol e jaqueta verde',
    title: 'Lançamentos gênesis de edição limitada',
    description: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
    author: 'Ren Aoki',
  },
  {
    id: 'selected-art',
    image: '/assets/marketplace/ape-cream-coat.png',
    imageAlt: 'Macaco com casaco claro',
    title: 'Arte digital selecionada e muito mais',
    description: 'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura digital.',
    author: 'Marina Kato',
  },
] as const

export type CreatorFeature = (typeof creatorFeatures)[number]
