import { Suspense, createContext, lazy, useCallback, useContext, useState, type ReactNode } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { clearPendingMarketplaceAction } from '@/lib/pending-marketplace-action'
import { useIsMobile } from '@/hooks/use-mobile'

const DesktopAuthDialog = lazy(() =>
  import('@/pages/marketplace/components/auth/desktop-auth-dialog').then((module) => ({
    default: module.DesktopAuthDialog,
  })),
)

type AuthDialogContextValue = {
  openAuthDialog: (options?: { register?: boolean; continueToPayment?: boolean; coupon?: string }) => void
}

// O mobile usa as telas Mobile / Login e Mobile / Cadastro do Figma, em tela cheia, e não o diálogo compacto do desktop.
const MobileAuthDialog = lazy(() =>
  import('@/pages/marketplace/components/auth/mobile-auth-dialog').then((module) => ({
    default: module.MobileAuthDialog,
  })),
)

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null)

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const currentHref = useRouterState({ select: (state) => state.location.href })
  const [isOpen, setIsOpen] = useState(false)
  const [register, setRegister] = useState(false)
  const [continueToPayment, setContinueToPayment] = useState(false)
  const [paymentCoupon, setPaymentCoupon] = useState('')
  const isMobile = useIsMobile()
  const AuthDialog = isMobile ? MobileAuthDialog : DesktopAuthDialog

  const openAuthDialog = useCallback(
    (options?: { register?: boolean; continueToPayment?: boolean; coupon?: string }) => {
      setRegister(options?.register ?? false)
      setContinueToPayment(options?.continueToPayment ?? false)
      setPaymentCoupon(options?.coupon ?? '')
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
    if (continueToPayment) {
      void navigate({ to: '/payment', search: { coupon: paymentCoupon || undefined } })
    }
  }

  return (
    <AuthDialogContext.Provider value={{ openAuthDialog }}>
      {children}
      {isOpen && (
        <Suspense fallback={null}>
          <AuthDialog
            open={isOpen}
            register={register}
            returnTo={currentHref}
            onOpenChange={handleOpenChange}
            onRegisterChange={setRegister}
            onSuccess={handleSuccess}
          />
        </Suspense>
      )}
    </AuthDialogContext.Provider>
  )
}

export function useAuthDialog() {
  const context = useContext(AuthDialogContext)
  if (!context) throw new Error('useAuthDialog must be used inside AuthDialogProvider')
  return context
}
