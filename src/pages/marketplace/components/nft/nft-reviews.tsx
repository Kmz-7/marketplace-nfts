import { useQuery } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { getNftReviews } from '@/api/review.api'
import { Card } from '@/components/ui/card'
import { StatusAlert } from '@/components/status-alert'
import { Skeleton } from '@/components/ui/skeleton'
import { NftReviewCard } from '@/pages/marketplace/components/nft/nft-review-card'

export function NftReviews({ nftId }: { nftId: string }) {
  const reviewsQuery = useQuery({
    queryKey: ['nft-reviews', nftId],
    queryFn: ({ signal }) => getNftReviews(nftId, signal),
  })

  if (reviewsQuery.isPending) {
    return (
      <div role="status" aria-label="Carregando avaliações" className="space-y-3">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-28 w-full rounded-lg" />
      </div>
    )
  }

  if (reviewsQuery.isError) {
    return (
      <StatusAlert description="Não foi possível carregar as avaliações. Tente novamente mais tarde." />
    )
  }

  const reviews = reviewsQuery.data

  return (
    <section aria-label="Avaliações de colecionadores" className="space-y-4">
      <Card className="flex-row items-center gap-3 rounded-lg border border-border bg-card/85 p-4 shadow-sm ring-0 backdrop-blur-md">
        <Star className="size-5 fill-primary text-primary" aria-hidden="true" />
        <p className="text-md font-semibold text-foreground">
          {reviews.averageRating.toFixed(1)}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            · {reviews.total} avaliações
          </span>
        </p>
      </Card>
      {reviews.items.length > 0 ? (
        <div className="space-y-3">
          {reviews.items.map((review) => <NftReviewCard key={review.id} review={review} />)}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Este NFT ainda não recebeu avaliações.</p>
      )}
    </section>
  )
}
