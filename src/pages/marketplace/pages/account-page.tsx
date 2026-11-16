import { useNavigate } from '@tanstack/react-router'
import { StatusAlert } from '@/components/status-alert'
import { AccountMobileMenu } from '@/pages/marketplace/components/account/account-mobile-menu'
import {
  AccountNavigation,
  type AccountSection,
} from '@/pages/marketplace/components/account/account-navigation'
import { ProfileEditor } from '@/pages/marketplace/components/account/profile-editor'
import { WalletSettings } from '@/pages/marketplace/components/account/wallet-settings'
import { MobileMarketplaceHeader } from '@/pages/marketplace/components/mobile-marketplace-header'

const sectionTitles: Record<AccountSection, string> = {
  profile: 'Meu perfil',
  wallets: 'Carteiras',
  activity: 'Atividade',
}

export function AccountPage({ section = 'profile' }: { section?: AccountSection }) {
  const navigate = useNavigate()

  return (
    <main className="grid min-h-[70vh] content-start gap-8 py-8 md:grid-cols-[240px_minmax(0,1fr)] md:py-12">
      {/* No mobile, a navegação da conta sai do topo da página e vai para o menu em tela cheia. */}
      <MobileMarketplaceHeader
        title={sectionTitles[section]}
        onBack={() => void navigate({ to: '/' })}
        action={<AccountMobileMenu section={section} />}
      />
      <aside className="hidden md:block">
        <AccountNavigation section={section} />
      </aside>
      <div className="min-w-0">
        {section === 'wallets' && <WalletSettings />}
        {section === 'profile' && <ProfileEditor />}
        {section === 'activity' && (
          <section aria-labelledby="activity-title" className="space-y-4">
            <h2 id="activity-title" className="hidden text-lg font-semibold md:block">
              Atividade
            </h2>
            <StatusAlert
              tone="info"
              title="Página em desenvolvimento"
              description="O histórico de compras ainda está sendo construído. Em breve você poderá acompanhar seus pedidos por aqui."
            />
          </section>
        )}
      </div>
    </main>
  )
}
