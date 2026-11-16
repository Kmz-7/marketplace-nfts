import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { LearningArticle } from '@/pages/learn/article-data'
import { LearningArticleCard } from './learning-article-card'

function getItemsPerPage() {
  if (window.matchMedia('(min-width: 1024px)').matches) return 4
  if (window.matchMedia('(min-width: 640px)').matches) return 2
  return 1
}

export function LearnMoreCarousel({ articles }: { articles: readonly LearningArticle[] }) {
  const listRef = useRef<HTMLDivElement>(null)
  const [itemsPerPage, setItemsPerPage] = useState(1)
  const [pageState, setPageState] = useState({ itemsPerPage: 1, activePage: 0 })
  const activePage = pageState.itemsPerPage === itemsPerPage ? pageState.activePage : 0
  const pageStarts = Array.from({ length: Math.ceil(articles.length / itemsPerPage) }, (_, index) =>
    index * itemsPerPage,
  )

  useEffect(() => {
    const updateItemsPerPage = () => setItemsPerPage(getItemsPerPage())
    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ left: 0 })
  }, [itemsPerPage])

  function goToPage(page: number) {
    const list = listRef.current
    const card = list?.firstElementChild
    if (!list || !card) return
    list.scrollTo({
      left: pageStarts[page] * (card.getBoundingClientRect().width + 20),
      behavior: 'smooth',
    })
    setPageState({ itemsPerPage, activePage: page })
  }

  function syncActivePage() {
    const list = listRef.current
    const card = list?.firstElementChild
    if (!list || !card) return
    const stride = card.getBoundingClientRect().width + 20
    const currentStart = list.scrollLeft / stride
    const closestPage = pageStarts.reduce(
      (closest, start, index) =>
        Math.abs(start - currentStart) < Math.abs(pageStarts[closest] - currentStart)
          ? index
          : closest,
      0,
    )
    setPageState({ itemsPerPage, activePage: closestPage })
  }

  return (
    <section aria-labelledby="learn-more-title" className="mt-20">
      <div className="border-b border-border pb-3">
        <h2 id="learn-more-title" className="text-lg font-semibold text-primary">
          Aprenda mais
        </h2>
      </div>
      {/* No Figma, Aprenda mais não seguia os cards da Home nem os indicadores de página; o carrossel compartilha o mesmo card e os pontos de Mais destaques. */}
      <div
        ref={listRef}
        onScroll={syncActivePage}
        className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth [scrollbar-none] [&::-webkit-scrollbar]:hidden"
        aria-label="Outras reportagens"
      >
        {articles.map((article) => (
          <div
            key={article.slug}
            className="w-[min(85vw,25rem)] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]"
          >
            <LearningArticleCard article={article} />
          </div>
        ))}
      </div>
      {pageStarts.length > 1 && (
        <div role="group" aria-label="Páginas de Aprenda mais" className="mt-5 flex justify-center gap-2">
          {pageStarts.map((_, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Mostrar grupo ${index + 1} de ${pageStarts.length}`}
              aria-pressed={activePage === index}
              onClick={() => goToPage(index)}
              className="size-6 rounded-lg border-0 p-0 hover:bg-transparent"
            >
              <span
                aria-hidden="true"
                className={`carousel-indicator border border-primary transition-all ${activePage === index ? 'bg-primary' : 'bg-transparent'}`}
              />
            </Button>
          ))}
        </div>
      )}
    </section>
  )
}
