import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { DesktopAuthDialog } from '@/pages/marketplace/components/auth/desktop-auth-dialog'
import { clearPendingMarketplaceAction } from '@/lib/pending-marketplace-action'

type AuthDialogContextValue = {
  openAuthDialog: (options?: { register?: boolean; continueToPayment?: boolean }) => void
}

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null)

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const currentHref = useRouterState({ select: (state) => state.location.href })
  const [isOpen, setIsOpen] = useState(false)
  const [register, setRegister] = useState(false)
  const [continueToPayment, setContinueToPayment] = useState(false)

  const openAuthDialog = useCallback(
    (options?: { register?: boolean; continueToPayment?: boolean }) => {
      setRegister(options?.register ?? false)
      setContinueToPayment(options?.continueToPayment ?? false)
      setIsOpen(true)
    },
    [],
  )

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) clearPendingMarketplaceAction()
  }

  const handleSuccess = () => {
    setIsOpen(false)
    if (continueToPayment) void navigate({ to: '/payment' })
  }

  return (
    <AuthDialogContext.Provider value={{ openAuthDialog }}>
      {children}
      <DesktopAuthDialog
        open={isOpen}
        register={register}
        returnTo={currentHref}
        onOpenChange={handleOpenChange}
        onRegisterChange={setRegister}
        onSuccess={handleSuccess}
      />
    </AuthDialogContext.Provider>
  )
}

export function useAuthDialog() {
  const context = useContext(AuthDialogContext)
  if (!context) throw new Error('useAuthDialog must be used inside AuthDialogProvider')
  return context
}
