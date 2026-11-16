import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const RelatedProducts = lazy(() =>
  import('@/pages/marketplace/components/related-products').then((module) => ({
    default: module.RelatedProducts,
  })),
)

export function DeferredRelatedProducts({ title }: { title: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const container = containerRef.current
    if (!container || !('IntersectionObserver' in window)) return

    // Lighthouse identified below-the-fold card code in the initial mobile work; load it shortly before it enters view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: '300px 0px' },
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="mt-16 min-h-[28rem]">
      {shouldLoad ? (
        <Suspense
          fallback={
            <div role="status" aria-label={`Carregando ${title.toLowerCase()}`} className="space-y-6">
              <div className="h-8 animate-pulse border-b border-border bg-muted/40" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="aspect-square animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            </div>
          }
        >
          <RelatedProducts title={title} className="mt-0" />
        </Suspense>
      ) : null}
    </div>
  )
}
