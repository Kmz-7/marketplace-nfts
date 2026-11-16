import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const articles = [
  {
    image: '/assets/marketplace/ape-cream-coat.png',
    date: '12 de setembro',
    readTime: 'Leitura de 4 min',
    title: 'Como funciona a propriedade de NFTs',
    description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
  },
  {
    image: '/assets/marketplace/ape-sunglasses.png',
    date: '13 de setembro',
    readTime: 'Leitura de 2 min',
    title: '10 artistas digitais para acompanhar',
    description: 'Conheça criadores que moldam a cultura digital.',
  },
  {
    image: '/assets/marketplace/ape-explorer.png',
    date: '15 de setembro',
    readTime: 'Leitura de 5 min',
    title: 'Raridade, atributos e procedência',
    description: 'Entenda raridade, procedência, direitos autorais e utilidade.',
  },
  {
    image: '/assets/marketplace/ape-headphones.png',
    date: '18 de setembro',
    readTime: 'Leitura de 3 min',
    title: 'Como proteger sua carteira',
    description: 'Proteja sua carteira, seus ativos e sua identidade.',
  },
]

export function HomeJournal() {
  return (
    <section id="destaques" aria-labelledby="journal-title" className="py-8 sm:py-10">
      <header className="mb-8 text-center">
        <h2 id="journal-title" className="text-xl font-semibold tracking-wide">
          Diário da Cunhagem
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <Card
            key={article.title}
            className="gap-0 overflow-hidden rounded-none border-0 bg-card p-0 ring-0"
          >
            <img src={article.image} alt="" className="aspect-1.5/1 w-full h-55 object-cover" />
            <CardContent className="flex flex-1 flex-col p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {article.date} <span className="px-1">|</span> {article.readTime}
              </p>
              <h3 className="mt-2 text-md leading-5 font-semibold">{article.title}</h3>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                {article.description}
              </p>
              <Button
                render={<a href="#destaques" />}
                variant="link"
                className="mt-auto h-auto flex justify-start gap-1 p-0 pt-3 text-xs tracking-wide hover:no-underline"
              >
                Ler mais <span aria-hidden="true">→</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
