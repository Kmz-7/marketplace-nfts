import { Link } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function MarketplaceBreadcrumb({
  currentPage,
  className,
}: {
  currentPage?: string
  className?: string
}) {
  return (
    <Breadcrumb aria-label="Caminho de navegação" className={className}>
      <BreadcrumbList className="gap-1.5 text-foreground">
        <BreadcrumbItem>
          <BreadcrumbLink
            render={<Link to="/" />}
            className="text-foreground transition-colors hover:text-primary"
          >
            Início
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <span className="text-foreground">Mercado</span>
        </BreadcrumbItem>
        {currentPage && (
          <>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPage}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
