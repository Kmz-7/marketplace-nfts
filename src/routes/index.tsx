import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/pages/home/home.page'

export const Route = createFileRoute('/')({
  // The Home catalog is the entry-screen LCP; an extra route chunk delayed it on mobile in Lighthouse.
  codeSplitGroupings: [],
  component: HomePage,
})
