import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { LearningArticle } from '@/pages/learn/article-data'

export function LearnMoreCarousel({ articles }: { articles: readonly LearningArticle[] }) {
  const listRef = useRef<HTMLDivElement>(null)

  function scroll(direction: -1 | 1) {
    const list = listRef.current
    if (!list) return
    list.scrollBy({ left: direction * list.clientWidth, behavior: 'smooth' })
  }

  return (
    <section aria-labelledby="learn-more-title" className="mt-20">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
        <h2 id="learn-more-title" className="text-lg font-semibold text-primary">Aprenda mais</h2>
        <div className="flex gap-2" role="group" aria-label="Navegar pelas reportagens">
          <Button type="button" variant="outline" size="icon-sm" aria-label="Reportagens anteriores" onClick={() => scroll(-1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button type="button" variant="outline" size="icon-sm" aria-label="Próximas reportagens" onClick={() => scroll(1)}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      {/* A sessão tinha um card a menos que o grid anterior; duas colunas deixam as imagens maiores e permitem navegar pelos artigos. */}
      <div
        ref={listRef}
        className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth [scrollbar-none] [&::-webkit-scrollbar]:hidden"
        aria-label="Outras reportagens"
      >
        {articles.map((article) => (
          <Card key={article.slug} className="w-[min(85vw,32rem)] shrink-0 snap-start gap-0 overflow-hidden rounded-xl border-border bg-card p-0 md:w-[calc((100%-1.25rem)/2)]">
            <img src={article.image} alt="" className="image-banner aspect-[4/3] w-full" />
            <CardContent className="flex h-full flex-col gap-3 p-4">
              <p className="text-xs text-muted-foreground">{article.date} · {article.readTime}</p>
              <h3 className="text-lg font-semibold text-foreground">{article.title}</h3>
              <p className="text-md text-muted-foreground">{article.description}</p>
              <Button render={<Link to="/learn" search={{ article: article.slug }} />} variant="link" className="mt-auto h-auto w-fit p-0 text-xs text-primary">
                Ler reportagem
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
