import { useState } from 'react'
import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { ReviewContract } from '@/types/review.contracts'

export function NftReviewCard({ review }: { review: ReviewContract }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const canExpand = review.comment.length > 150

  // O padrão do toast usa fundo translúcido e borda sutil; avaliações adotam a mesma superfície e limitam o texto a duas linhas.
  return (
    <Card className="gap-3 rounded-lg border border-border bg-card/85 p-4 text-secondary-foreground shadow-sm ring-0 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Avatar className="size-10">
          <AvatarImage src={review.userAvatarUrl} alt={`Avatar de ${review.userName}`} />
          <AvatarFallback>{review.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2">
          <p className="max-w-full truncate text-sm font-semibold text-foreground">
            {review.userName}
          </p>
          <div
            role="img"
            aria-label={`${review.rating} de 5 estrelas`}
            className="flex items-center gap-1"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={`size-4 ${index < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
      <p
        className={`text-sm leading-6 text-muted-foreground transition-[max-height] duration-300 ${isExpanded ? 'max-h-96' : 'line-clamp-2 max-h-12'}`}
      >
        {review.comment}
      </p>
      {canExpand && (
        <Button
          type="button"
          variant="link"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="ml-auto h-auto p-0 text-xs text-primary"
        >
          {isExpanded ? 'Ler menos' : 'Ler mais'}
        </Button>
      )}
    </Card>
  )
}
