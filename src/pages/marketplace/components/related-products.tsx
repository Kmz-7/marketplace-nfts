import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { HomeNftCard } from '@/pages/home/components/home-nft-card'
import { items } from '@/pages/marketplace/marketplace-data'

export function RelatedProducts({ title }: { title: string }) {
  const listRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const itemsPerPage = isMobile ? 2 : 5
  const visibleItems = Math.min(items.length, itemsPerPage)
  const maxStart = Math.max(0, items.length - visibleItems)
  const pageStarts = useMemo(
    () =>
      Array.from({ length: Math.ceil(maxStart / visibleItems) + 1 }, (_, index) =>
        Math.min(index * visibleItems, maxStart),
      ),
    [maxStart, visibleItems],
  )
  const [pageState, setPageState] = useState({ itemsPerPage, activePage: 0 })
  const activePage = pageState.itemsPerPage === itemsPerPage ? pageState.activePage : 0

  useEffect(() => {
    listRef.current?.scrollTo({ left: 0 })
  }, [itemsPerPage])

  const goToPage = useCallback(
    (page: number) => {
      const list = listRef.current
      const card = list?.firstElementChild
      if (list && card) {
        list.scrollTo({
          left: pageStarts[page] * (card.getBoundingClientRect().width + 20),
          behavior: 'smooth',
        })
        setPageState({ itemsPerPage, activePage: page })
      }
    },
    [itemsPerPage, pageStarts],
  )

  useEffect(() => {
    if (pageStarts.length <= 1) return
    const intervalId = window.setInterval(() => {
      goToPage((activePage + 1) % pageStarts.length)
    }, 5000)
    return () => window.clearInterval(intervalId)
  }, [activePage, goToPage, pageStarts.length])

  const syncActivePage = () => {
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
    <section className="mt-16" aria-label={title}>
      <div className="border-b border-border pb-3">
        <h2 className="text-lg font-semibold text-primary">{title}</h2>
      </div>
      <div
        ref={listRef}
        onScroll={syncActivePage}
        className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth [scrollbar-none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div
            key={`${title}-${item.name}`}
            className="w-[calc((100%-1.25rem)/2)] shrink-0 snap-start md:w-[calc((100%-5rem)/5)]"
          >
            <HomeNftCard name={item.name} image={item.image} price={item.price} creator="ETH" />
          </div>
        ))}
      </div>
      {pageStarts.length > 1 && (
        <div
          role="group"
          aria-label={`Páginas de ${title}`}
          className="mt-5 flex justify-center gap-2"
        >
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
