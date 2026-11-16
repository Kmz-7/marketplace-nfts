import { homeLearningArticles } from '@/pages/learn/article-data'
import { LearningArticleCard } from '@/pages/learn/components/learning-article-card'

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
        {homeLearningArticles.map((article) => (
          <LearningArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  )
}
