import { useSearch } from '@tanstack/react-router'
import { MarketplaceBreadcrumb } from '@/pages/marketplace/components/marketplace-breadcrumb'
import { LearnMoreCarousel } from './components/learn-more-carousel'
import { learningArticles } from './article-data'

export function LearnPage() {
  const { article: articleSlug } = useSearch({ from: '/learn' })
  const article = learningArticles.find((entry) => entry.slug === articleSlug) ?? learningArticles[0]
  const moreArticles = learningArticles.filter((entry) => entry.slug !== article.slug)

  return (
    <main className="py-8 md:py-10">
      <MarketplaceBreadcrumb currentPage="Aprenda" includeMarket={false} className="mb-8 text-xs" />
      <article className="mx-auto w-full max-w-4xl space-y-5">
        <img src={article.image} alt="" fetchPriority="high" className="image-banner aspect-video w-full rounded-xl object-cover" />
        <header className="space-y-3">
          <p className="text-xs text-muted-foreground">{article.date} · {article.readTime}</p>
          <h1 className="text-lg font-semibold text-foreground">{article.title}</h1>
          <p className="text-md text-muted-foreground">{article.description}</p>
        </header>
        {/* O Figma aproximava a primeira linha do menu da aba; a página editorial reserva espaço regular antes do texto. */}
        <div className="space-y-4 pt-3 text-md leading-7 text-muted-foreground">
          {article.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </article>
      <LearnMoreCarousel articles={moreArticles} />
    </main>
  )
}
