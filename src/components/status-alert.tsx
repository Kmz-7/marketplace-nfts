import type { ComponentProps, ReactNode } from 'react'
import { Info, PackageOpen, TriangleAlert, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const tones: Record<StatusAlertTone, { icon: LucideIcon; iconClassName: string; role: 'alert' | 'status' }> = {
  error: { icon: TriangleAlert, iconClassName: 'text-primary', role: 'alert' },
  empty: { icon: PackageOpen, iconClassName: 'text-muted-foreground', role: 'status' },
  info: { icon: Info, iconClassName: 'text-link', role: 'status' },
}

export type StatusAlertTone = 'error' | 'empty' | 'info'

/**
 * Alerta padrão para páginas e seções com erro, sem conteúdo ou indisponíveis.
 * Ícone à esquerda; título opcional, descrição e ação compacta ocupam a largura restante.
 */
export function StatusAlert({
  tone = 'error',
  title,
  headingLevel: Heading = 'h2',
  description,
  action,
  className,
}: {
  tone?: StatusAlertTone
  title?: string
  /** Nível semântico do título; use `h1` quando o alerta substitui o conteúdo da página. */
  headingLevel?: 'h1' | 'h2' | 'h3'
  description: ReactNode
  /** Use `StatusAlertAction` para manter o tamanho padrão da ação. */
  action?: ReactNode
  className?: string
}) {
  const { icon: Icon, iconClassName, role } = tones[tone]

  return (
    <Alert variant="status" role={role} className={className}>
      <Icon className={cn('size-4', iconClassName)} aria-hidden="true" />
      {title && (
        <AlertTitle className="text-md font-bold text-foreground">
          <Heading>{title}</Heading>
        </AlertTitle>
      )}
      <AlertDescription className={cn('col-start-2 text-sm', !title && !action && 'row-span-2')}>
        {description}
      </AlertDescription>
      {action && <div className="col-start-2 mt-2">{action}</div>}
    </Alert>
  )
}

/** Ação do StatusAlert: botão compacto de superfície (exceção à largura total no mobile, por ficar dentro do alerta). */
export function StatusAlertAction({ className, ...props }: ComponentProps<typeof Button>) {
  return <Button type="button" variant="surface" size="sm" className={cn('h-8 px-3', className)} {...props} />
}
