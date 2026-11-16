type CompatibleWalletsProps = {
  className?: string
}

export function CompatibleWallets({ className = '' }: CompatibleWalletsProps) {
  // No Figma, os nomes das carteiras e separadores não compartilhavam um eixo; a grade centraliza cada item na mesma faixa.
  return (
    <div
      role="group"
      aria-label="Carteiras compatíveis"
      className={`grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-x-2 whitespace-nowrap rounded-lg border border-surface-dark-border bg-surface-dark px-3 py-1 text-center text-xs uppercase text-primary ${className}`}
    >
      <span>MetaMask</span>
      <span className="text-muted-foreground" aria-hidden="true">
        ·
      </span>
      <span>WalletConnect</span>
      <span className="text-muted-foreground" aria-hidden="true">
        ·
      </span>
      <span>Coinbase</span>
    </div>
  )
}
