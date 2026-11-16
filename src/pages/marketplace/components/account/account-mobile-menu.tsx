import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { HambergerMenuIcon } from '@/components/ui/icons'
import { AccountNavigation, type AccountSection } from '@/pages/marketplace/components/account/account-navigation'

/** Menu do perfil no mobile: sobrepõe a tela inteira com fundo translúcido e desfoque, como o toast e os menus do desktop. */
export function AccountMobileMenu({ section }: { section: AccountSection }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        variant="surface"
        size="icon-lg"
        aria-label="Abrir menu do perfil"
        aria-expanded={open}
        className="text-muted-foreground shadow-lg"
        onClick={() => setOpen(true)}
      >
        <HambergerMenuIcon />
      </Button>
      {open && (
        <Dialog open onOpenChange={setOpen}>
          <DialogContent
            variant="fullscreen"
            closeLabel="Fechar menu do perfil"
            className="bg-background/80 px-7 pt-24 backdrop-blur-md"
            overlayClassName="bg-background/40 backdrop-blur-sm"
          >
            <DialogTitle className="mb-4 text-center text-lg font-bold">Meu perfil</DialogTitle>
            <DialogDescription className="sr-only">Navegue entre as seções da sua conta.</DialogDescription>
            <AccountNavigation section={section} variant="list" />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
