import { createFileRoute } from '@tanstack/react-router'
import { FavoritesPage } from '@/pages/marketplace/pages/favorites-page'
import { requireAuthentication } from '@/lib/require-authentication'

export const Route = createFileRoute('/favorites')({
  beforeLoad: () => requireAuthentication('/favorites'),
  component: FavoritesPage,
})
