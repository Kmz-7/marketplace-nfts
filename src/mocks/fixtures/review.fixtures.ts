import type { ReviewContract } from '@/types/review.contracts'
import { nftFixtures } from './nft.fixtures'
import { reviewerFixtures } from './user.fixtures'

const shortComments = [
  'A arte tem ótimos detalhes e combina muito com a coleção.',
  'Gostei da composição e da paleta de cores. Ficou excelente na minha galeria.',
  'Peça muito bem acabada. A imagem é ainda mais bonita de perto.',
  'Uma adição especial para a coleção, com identidade visual marcante.',
  'Adorei a proposta e os detalhes que aparecem em cada parte da arte.',
  'Entrega uma experiência muito boa para quem acompanha a coleção.',
  'As cores e a expressão do personagem chamam atenção na medida certa.',
  'Gostei da história por trás da peça e do cuidado na apresentação.',
]

const longComments = [
  'A peça superou minhas expectativas. Os detalhes da ilustração ficam muito bem resolvidos em tamanho maior, e a combinação de cores conversa com o restante da coleção sem parecer repetida. Também gostei de acompanhar a procedência e as informações da edição antes de decidir pela compra.',
  'Escolhi este NFT pela personalidade da arte e acabei gostando ainda mais dos pequenos elementos que aparecem quando observamos a imagem com calma. A composição funciona muito bem na minha galeria, e a peça tem uma presença própria entre os outros trabalhos do artista.',
  'Uma das minhas peças favoritas da coleção até agora. A arte tem detalhes interessantes, boa leitura mesmo em miniatura e uma paleta que combina com a proposta do projeto. Foi fácil conferir a edição e os dados do item, então a experiência de colecionar também foi bem tranquila.',
]

const ratings = [5, 4, 5, 4]

// Cada NFT recebe quatro avaliações de perfis diferentes, incluindo um comentário longo para demonstrar a expansão.
export const reviewFixtures: ReviewContract[] = nftFixtures.flatMap((nft, nftIndex) =>
  ratings.map((rating, reviewIndex) => {
    const reviewer = reviewerFixtures[(nftIndex * ratings.length + reviewIndex) % reviewerFixtures.length]
    const comment =
      reviewIndex === ratings.length - 1
        ? longComments[nftIndex % longComments.length]
        : shortComments[(nftIndex + reviewIndex) % shortComments.length]

    return {
      id: `review-${nft.id}-${reviewIndex + 1}`,
      nftId: nft.id,
      userId: reviewer.id,
      userName: reviewer.name,
      userAvatarUrl: reviewer.avatarUrl,
      rating,
      comment,
      createdAt: new Date(Date.UTC(2026, 9, 20 - nftIndex * 2 - reviewIndex)).toISOString(),
    }
  }),
)
