import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { LearningArticle } from '@/pages/learn/article-data'

export function LearningArticleCard({
  article,
}: {
  article: LearningArticle
}) {
  return (
    <Card className="h-full gap-0 overflow-hidden rounded-none border-0 bg-card p-0 ring-0">
      <img src={article.image} alt="" loading="lazy" decoding="async" className="image-banner aspect-1.5/1 h-55 w-full" />
      {/* No Figma, título, descrição e ação variavam entre cards; md/sm, duas linhas e mt-auto alinham o botão na base. */}
      <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {article.date} <span className="px-1">|</span> {article.readTime}
        </p>
        <h3 className="min-h-12 line-clamp-2 text-md leading-6 font-semibold">{article.title}</h3>
        <p className="min-h-10 line-clamp-2 text-sm leading-5 text-muted-foreground">
          {article.description}
        </p>
        <Button
          render={<Link to="/learn" search={{ article: article.slug }} />}
          variant="link"
          className="mt-auto min-h-8 w-fit justify-start gap-1 p-0 text-xs tracking-wide hover:no-underline"
        >
          Ler mais <span aria-hidden="true">→</span>
        </Button>
      </CardContent>
    </Card>
  )
}
