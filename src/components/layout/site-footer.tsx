import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { CompatibleWallets } from '@/components/compatible-wallets'
import { toast } from 'sonner'
import { InputGroup, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'

const benefits = [
  {
    initial: 'W',
    title: 'Segurança da carteira',
    text: 'Proteja sua carteira e colecione arte digital verificada com confiança.',
  },
  {
    initial: 'C',
    title: 'Criadores em destaque',
    text: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
  },
  {
    initial: 'D',
    title: 'Alertas de lançamentos',
    text: 'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.',
  },
]

const footerGroups = [
  {
    title: 'Meu perfil',
    links: ['Meu perfil', 'Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse'],
  },
  {
    title: 'Central de ajuda',
    links: [
      'Central de ajuda',
      'Como comprar NFTs',
      'Carteira e segurança',
      'Política do mercado',
      'Denunciar item',
    ],
  },
  { title: 'Coleções', links: ['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade'] },
]

const socialLinks = [
  { label: 'Facebook', image: '/assets/social/facebook.svg' },
  { label: 'Instagram', image: '/assets/social/instagram.svg' },
  { label: 'X', image: '/assets/social/x.svg' },
  { label: 'LinkedIn', image: '/assets/social/linkedin.svg' },
  { label: 'YouTube', image: '/assets/social/youtube.svg' },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <div className="mx-auto w-full max-w-[1200px] bg-secondary">
        <section
          className="grid gap-6 p-8 md:grid-cols-2 lg:min-h-[250px] lg:grid-cols-4 lg:gap-3"
          aria-label="Vantagens e novidades"
        >
          {benefits.map(({ initial, title, text }) => (
            <Card
              key={title}
              className="flex flex-col gap-2 rounded-none border-0 bg-transparent p-0 text-foreground ring-0 lg:border-r lg:border-primary/50 lg:pr-3"
            >
              <div className="flex size-[75px] shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary text-lg font-bold text-primary-foreground">
                {initial}
              </div>
              <h2 className="text-lg leading-4 font-bold">{title}</h2>
              <p className="max-w-[204px] text-md leading-6 text-muted-foreground">{text}</p>
            </Card>
          ))}
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              // O endpoint de newsletter ainda não existe; a recarga simulada limpa o campo após a confirmação.
              toast.success('Seu email foi cadastrado em nosso newslettrer, acompanhe as novidades que te enviarmos')
              window.setTimeout(() => window.location.reload(), 5000)
            }}
          >
            <Label variant="newsletterTitle" htmlFor="newsletter-email">
              Antecipe-se ao próximo lançamento
            </Label>
            {/* No Figma, input e envio tinham raios e foco separados; o grupo compartilha a borda e o foco em todo o conjunto. */}
            <InputGroup className="h-10 rounded-lg border-primary bg-surface-dark focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
              <InputGroupInput
                id="newsletter-email"
                type="email"
                placeholder="digite seu e-mail..."
                aria-label="E-mail para novidades"
                required
                className="h-full rounded-none px-3 text-xs focus-visible:ring-0"
              />
              <InputGroupButton type="submit" variant="default" className="h-full rounded-none rounded-r-lg px-3 text-sm">
                Enviar
              </InputGroupButton>
            </InputGroup>
            <p className="mt-3 text-md leading-6 text-muted-foreground">
              Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
            </p>
          </form>
        </section>
        {/* No Figma, a descrição do rodapé aparecia menor que os demais parágrafos; ela segue a escala md. */}
        <div className="grid gap-4 bg-surface-dark/80 px-8 py-5 sm:grid-cols-2 lg:h-[88px] lg:grid-cols-4 lg:items-center lg:py-0">
          <Button
            render={<Link to="/" />}
            variant="ghost"
            className="h-auto justify-start p-0 text-sm font-bold tracking-[0.18em] hover:bg-transparent"
          >
            KURIO
          </Button>
          <p className="text-md leading-6 text-muted-foreground">
            Feito para colecionadores,
            <br />
            criadores e cultura
          </p>
          <Button
            render={<a href="mailto:contato@email.com" />}
            variant="ghost"
            className="h-auto justify-start p-0 text-sm font-normal text-foreground hover:bg-transparent hover:text-link"
          >
            contato@email.com
          </Button>
          <Button
            render={<a href="tel:+551140028922" />}
            variant="ghost"
            className="h-auto justify-start p-0 text-sm font-normal text-foreground hover:bg-transparent hover:text-link"
          >
            +55 11 4002 8922
          </Button>
        </div>
        <div className="grid gap-8 p-8 sm:grid-cols-2 lg:min-h-[236px] lg:grid-cols-4">
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="mb-3 text-lg leading-4 font-bold">{group.title}</h2>
              <ul>
                {group.links.map((link) => (
                  <li key={link}>
                    <Button
                      render={<a href="#" />}
                      variant="ghost"
                      className="h-auto justify-start p-0 text-sm leading-7.5 font-normal text-foreground hover:bg-transparent hover:text-link"
                    >
                      {link}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <section>
            <h2 className="mb-5 text-lg leading-4 font-bold">Redes sociais</h2>
            <div className="flex gap-2.5">
              {socialLinks.map(({ label, image }) => (
                <Button
                  key={label}
                  render={<a href="#" />}
                  variant="ghost"
                  size="icon"
                  aria-label={label}
                  className="size-7.5 rounded-none p-0 hover:bg-transparent dark:hover:bg-transparent"
                >
                  <img src={image} alt="" aria-hidden="true" className="size-full" />
                </Button>
              ))}
            </div>
            <div className="mt-8 w-fit">
              <h3 className="text-lg leading-4 font-bold">Carteiras compatíveis</h3>
              <CompatibleWallets className="mt-3" />
            </div>
          </section>
        </div>
      </div>
      <p className="mx-auto max-w-[1200px] py-4 text-center text-xs text-foreground">
        © {new Date().getFullYear()} Kurio. Propriedade digital para todos.
      </p>
    </footer>
  )
}
