import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { items } from '@/pages/marketplace/marketplace-data'

export function HeaderNftSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR')
  const results = normalizedQuery
    ? items
        .filter((item) => `${item.name} ${item.creator}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery))
        .slice(0, 2)
    : []

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={isOpen ? 'Fechar busca' : 'Buscar NFTs'}
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((open) => !open)
          setQuery('')
        }}
      >
        {isOpen ? <X className="size-4" /> : <Search className="size-4" />}
      </Button>
      {isOpen && (
        <>
        {/* O Figma mostrava somente o ícone de busca; o painel translúcido preserva o contexto da página e antecipa os dois resultados mais compatíveis. */}
        <section aria-label="Busca de NFTs" className="absolute top-full right-0 z-50 mt-2 w-[min(24rem,calc(100vw-2rem))]">
          <Card className="gap-3 rounded-lg border-border bg-card/85 p-3 shadow-lg ring-0 backdrop-blur-md">
            <Input
              autoFocus
              aria-label="Busque um NFT"
              placeholder="Busque um NFT"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              variant="search"
              className="h-10 rounded-lg border border-border pl-3 text-sm"
            />
            {normalizedQuery && (
              <div className="space-y-2">
                {results.length ? results.map((item) => (
                  <Button
                    key={item.id}
                    render={<Link to="/nft" search={{ item: item.id }} />}
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-md border border-border bg-background p-2 text-left hover:border-primary hover:bg-background"
                    onClick={() => setIsOpen(false)}
                  >
                    <img src={item.image} alt="" className="image-thumbnail rounded-sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">{item.name}</span>
                      <span className="block text-xs text-primary">{item.price} ETH</span>
                    </span>
                  </Button>
                )) : (
                  <p className="px-2 py-3 text-xs text-muted-foreground">Nenhum NFT encontrado.</p>
                )}
              </div>
            )}
          </Card>
        </section>
        </>
      )}
    </div>
  )
}
