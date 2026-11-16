import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'
import { learningArticles } from '@/pages/learn/article-data'

export function HomeJournal() {
  return (
    <section id="destaques" aria-labelledby="journal-title" className="py-8 sm:py-10">
      {/* No Figma, o respiro entre título e descrição variava; a pilha aplica a mesma distância de 12 px. */}
      <header className="mb-8 space-y-3 text-center">
        <h2 id="journal-title" className="text-lg font-semibold tracking-wide">
          Diário da Cunhagem
        </h2>
        <p className="text-xs text-muted-foreground">
          Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {learningArticles.map((article) => (
          <Card
            key={article.title}
            className="gap-0 overflow-hidden rounded-none border-0 bg-card p-0 ring-0"
          >
            <img src={article.image} alt="" className="image-banner aspect-1.5/1 h-55 w-full" />
            {/* O exemplo do Figma deixava o texto muito próximo da imagem e os blocos variavam de altura; o padding e a reserva de duas linhas uniformizam os cards. */}
            <CardContent className="flex flex-1 flex-col space-y-3 px-4 pb-4 pt-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {article.date} <span className="px-1">|</span> {article.readTime}
              </p>
              <h3 className="min-h-10 text-lg leading-6 font-semibold">{article.title}</h3>
              <p className="min-h-12 line-clamp-2 text-md leading-6 text-muted-foreground">
                {article.description}
              </p>
              {/* O exemplo do Figma deixava o link sem respiro previsível após a descrição; a pilha mantém a distância igual nos cards. */}
              <Button
                render={<Link to="/learn" search={{ article: article.slug }} />}
                variant="link"
                className="h-auto w-fit justify-start gap-1 p-0 text-xs tracking-wide hover:no-underline"
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
