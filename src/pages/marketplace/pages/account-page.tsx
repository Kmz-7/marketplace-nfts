import { AccountNavigation } from '@/pages/marketplace/components/account/account-navigation'
import { ProfileEditor } from '@/pages/marketplace/components/account/profile-editor'
import { WalletSettings } from '@/pages/marketplace/components/account/wallet-settings'

export function AccountPage({ wallets = false }: { wallets?: boolean }) {
  return (
    <main className="grid min-h-[70vh] gap-8 py-8 md:grid-cols-[240px_minmax(0,1fr)] md:py-12">
      <aside>
        <AccountNavigation wallets={wallets} />
      </aside>
      <div className="min-w-0">{wallets ? <WalletSettings /> : <ProfileEditor />}</div>
    </main>
  )
}
