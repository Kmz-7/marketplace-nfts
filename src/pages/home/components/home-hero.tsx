import { Button } from '@/components/ui/button'

export function HomeHero() {
  return (
    <section
      className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_0.9fr] lg:min-h-[450px] lg:grid-cols-[minmax(0,640px)_minmax(0,450px)] lg:justify-between"
      aria-labelledby="home-hero-title"
    >
      <div className="max-w-[600px] lg:pl-10">
        <p className="mb-4 text-sm font-semibold text-foreground">Bem-vindo à Kurio</p>
        <h1
          id="home-hero-title"
          className="max-w-[600px] text-3xl leading-[1.2] font-bold uppercase sm:text-4xl lg:text-[43px] lg:leading-[70px]"
        >
          Seja dono do futuro
          <br className="hidden lg:block" /> da arte digital
        </h1>
        <p className="mt-4 max-w-[600px] text-sm leading-6 text-muted-foreground">
          Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital
          rara, apoie artistas e tenha uma parte da cultura da internet.
        </p>
        <Button
          render={<a href="#catalogo" />}
          className="mt-6 h-9 px-6 text-xs uppercase tracking-wide"
        >
          Explorar
        </Button>
        {/* O Figma deixava os pontos do banner menores que os do carrossel de produtos; os indicadores compartilham agora a mesma medida. */}
        <div className="mt-8 flex justify-end gap-2 pr-3" aria-label="Slide 1 de 3">
          <span className="carousel-indicator bg-primary" />
          <span className="carousel-indicator bg-muted-foreground/40" />
          <span className="carousel-indicator bg-muted-foreground/40" />
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-[450px] overflow-hidden rounded-3xl bg-card md:ml-auto">
        <img
          src="/assets/marketplace/ape-sunglasses.png"
          alt="NFT de macaco com óculos e jaqueta verde"
          className="image-banner aspect-square w-full"
        />
      </div>
    </section>
  )
}
