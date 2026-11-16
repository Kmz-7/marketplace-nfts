import { createFileRoute } from '@tanstack/react-router'
import { LearnPage } from '@/pages/learn/learn-page'

export const Route = createFileRoute('/learn')({
  validateSearch: (search: Record<string, unknown>) => ({
    article: typeof search.article === 'string' ? search.article : undefined,
  }),
  component: LearnPage,
})
