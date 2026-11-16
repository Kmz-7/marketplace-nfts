import { createFileRoute } from '@tanstack/react-router'
import { CreatorsPage } from '@/pages/creators/creators-page'

export const Route = createFileRoute('/creators')({
  validateSearch: (search: Record<string, unknown>) => ({
    feature: typeof search.feature === 'string' ? search.feature : undefined,
  }),
  component: CreatorsPage,
})
