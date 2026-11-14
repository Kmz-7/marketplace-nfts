import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, HeartIcon, LogOutIcon, MinusIcon, PlusIcon, ShoppingCartIcon, StarIcon, Trash2Icon, UserRoundIcon, WalletIcon } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useIsMobile } from '@/hooks/use-mobile'
import { HomePage } from '@/pages/home/home.page'
import { HomeNftCard } from '@/pages/home/components/home-nft-card'

const images = {
  emerald: '/assets/marketplace/ape-sunglasses.png',
  violet: '/assets/marketplace/ape-explorer.png',
  ivory: '/assets/marketplace/ape-cream-coat.png',
  golden: '/assets/marketplace/ape-headphones.png',
}

const items = [
  { name: 'Emerald Ape #042', edition: '1/50', price: '1.19', image: images.emerald },
  { name: 'Violet Nomad #314', edition: '1/1', price: '1.39', image: images.violet },
  { name: 'Ivory Baron #088', edition: '1/10', price: '1.79', image: images.ivory },
  { name: 'Golden Beat #207', edition: '1/50', price: '0.99', image: images.golden },
  { name: 'Emerald Signal #160', edition: '1/25', price: '0.89', image: images.emerald },
  { name: 'Sage Nomad #009', edition: '1/1', price: '1.69', image: images.violet },
  { name: 'Ivory Baron #883', edition: '1/10', price: '1.79', image: images.ivory },
  { name: 'Golden Hour #409', edition: '1/50', price: '0.89', image: images.golden },
]

function BackButton() {
  return <Button render={<a href="/" />} size="icon" variant="secondary" className="rounded-full" aria-label="Voltar"><ArrowLeftIcon /></Button>
}

function PageHeading({ children }: { children: string }) {
  return <div className="mb-6 flex items-center gap-4 md:mb-10"><BackButton /><h1 className="flex-1 text-center text-lg font-bold md:text-left md:text-2xl">{children}</h1></div>
}

function RelatedProducts({ title }: { title: string }) {
  const listRef = useRef<HTMLDivElement>(null)
  const move = (direction: -1 | 1) => {
    const list = listRef.current
    const card = list?.firstElementChild
    if (list && card) list.scrollBy({ left: direction * (card.getBoundingClientRect().width + 20) * 5, behavior: 'smooth' })
  }

  return (
    <section className="mt-16" aria-label={title}>
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="text-sm font-semibold text-primary">{title}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon-sm" className="rounded-sm border-[#3F2319]" aria-label="Ver NFTs anteriores" onClick={() => move(-1)}><ArrowLeftIcon /></Button>
          <Button variant="outline" size="icon-sm" className="rounded-sm border-[#3F2319]" aria-label="Ver próximos NFTs" onClick={() => move(1)}><ArrowRightIcon /></Button>
        </div>
      </div>
      <div ref={listRef} className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => <div key={`${title}-${item.name}`} className="w-[calc((100%-1.25rem)/2)] shrink-0 snap-start md:w-[calc((100%-5rem)/5)]"><HomeNftCard name={item.name} image={item.image} price={item.price} creator="ETH" /></div>)}
      </div>
    </section>
  )
}

export function NftPage() {
  const gallery = [images.emerald, images.ivory, images.violet, images.golden]
  const [selectedImage, setSelectedImage] = useState(gallery[0])
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const shareUrl = encodeURIComponent(window.location.href)

  useEffect(() => {
    if (!isImageLoading) return
    const timeout = window.setTimeout(() => setIsImageLoading(false), 350)
    return () => window.clearTimeout(timeout)
  }, [selectedImage, isImageLoading])

  const selectImage = (image: string) => {
    if (image === selectedImage) return
    setIsImageLoading(true)
    setSelectedImage(image)
  }

  return (
    <main className="py-7 md:py-12">
      <p className="mb-5 text-xs text-muted-foreground"><Link to="/" className="transition-colors hover:text-primary">Início</Link><span className="px-2">/</span><span>Mercado</span></p>
      <section className="grid items-start gap-6 md:grid-cols-2 md:gap-12" aria-label="Detalhes do Emerald Ape #042">
        <div className="flex flex-col-reverse gap-3 md:flex-row">
          <div className="grid grid-cols-4 gap-2 md:flex md:w-[76px] md:flex-col">
            {gallery.map((image, index) => (
              <Button key={image} type="button" variant="ghost" aria-label={`Ver imagem ${index + 1} do NFT`} aria-pressed={selectedImage === image} onClick={() => selectImage(image)} className={`h-auto w-full rounded-lg border p-0 hover:bg-transparent ${selectedImage === image ? 'border-primary' : 'border-transparent'}`}>
                <img src={image} alt="" className="aspect-square w-full rounded-md object-cover" />
              </Button>
            ))}
          </div>
          <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl bg-card">
            {isImageLoading ? <Skeleton className="absolute inset-0 aspect-square h-full w-full rounded-2xl" /> : <img src={selectedImage} alt="Emerald Ape #042" className="aspect-square w-full rounded-2xl object-cover" />}
          </div>
        </div>

        <Card className="gap-0 rounded-2xl bg-card p-5 ring-0 md:bg-transparent md:p-0">
          <CardContent className="p-0">
            <h1 className="text-lg font-bold md:text-2xl">Emerald Ape #042</h1>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xl font-bold text-primary">1.19 ETH</p>
              <div className="flex flex-wrap items-center gap-2" aria-label="Avaliação de 4 de 5 estrelas, 19 avaliações de colecionadores">
                <span className="flex items-center gap-0.5" aria-hidden="true">{[0, 1, 2, 3, 4].map((star) => <StarIcon key={star} variant="Bold" className={`size-4 ${star < 4 ? 'text-primary' : 'text-[#CFB28C]'}`} />)}</span>
                <span className="text-xs text-foreground">19 avaliações de colecionadores</span>
              </div>
            </div>

            <Separator className="my-5 bg-border" />

            <section aria-labelledby="about-nft-title">
              <h2 id="about-nft-title" className="text-sm font-semibold text-foreground">Sobre este NFT:</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.</p>
            </section>

            <h2 className="mt-5 text-sm font-semibold">Edição:</h2>
            <div className="mt-2 flex gap-2">{['1/10', '1/10', '1/50', 'ABERTA'].map((edition, index) => <Badge key={index} variant="outline" className="h-auto rounded-full border-border px-3 py-1 text-xs text-muted-foreground">{edition}</Badge>)}</div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex h-12 items-center gap-3 rounded-md border border-border px-3">
                <span className="text-sm">Qtd.</span>
                <Button type="button" variant="secondary" size="icon-sm" className="h-9 w-10 rounded-md" aria-label="Diminuir quantidade" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><MinusIcon /></Button>
                <span className="min-w-4 text-center text-sm">{quantity}</span>
                <Button type="button" variant="secondary" size="icon-sm" className="h-9 w-10 rounded-md" aria-label="Aumentar quantidade" onClick={() => setQuantity((value) => value + 1)}><PlusIcon /></Button>
              </div>
              <p className="ml-auto text-sm font-bold text-primary">{(1.19 * quantity).toFixed(2)} ETH</p>
            </div>
            <div className="mt-3 flex gap-3">
              <Button render={<a href="/pagamento" />} className="h-12 flex-1 rounded-lg">Comprar</Button>
              <Button type="button" variant="outline" aria-pressed={isFavorite} onClick={() => setIsFavorite((value) => !value)} className="h-12 gap-2 border-primary bg-transparent px-4 text-primary hover:bg-primary/10 hover:text-primary"><HeartIcon className="size-4" />{isFavorite ? 'Favoritado' : 'Favoritar'}</Button>
            </div>

            <div className="mt-5 space-y-2 text-xs leading-5 text-muted-foreground">
              <p><span className="text-foreground">ID:</span> #0042</p>
              <p><span className="text-foreground">Coleção:</span> Kurio Apes</p>
              <p><span className="text-foreground">Atributos:</span> Óculos, Esmeralda, Raro</p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Compartilhar este NFT:</span>
              <Button render={<a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noreferrer" />} variant="ghost" size="icon-sm" aria-label="Compartilhar no LinkedIn" className="size-7 p-1 hover:bg-transparent"><img src="/assets/social/share-linkedin.svg" alt="" className="size-full" /></Button>
              <Button render={<a href="mailto:?subject=Emerald%20Ape%20%23042&body=Confira%20este%20NFT" />} variant="ghost" size="icon-sm" aria-label="Compartilhar por e-mail" className="size-7 p-1 hover:bg-transparent"><img src="/assets/social/share-email.svg" alt="" className="size-full" /></Button>
              <Button render={<a href={`https://twitter.com/intent/tweet?text=Confira%20Emerald%20Ape%20%23042&url=${shareUrl}`} target="_blank" rel="noreferrer" />} variant="ghost" size="icon-sm" aria-label="Compartilhar no Twitter" className="size-7 p-1 hover:bg-transparent"><img src="/assets/social/share-twitter.svg" alt="" className="size-full" /></Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="details" className="mt-12 md:mt-16">
        <TabsList variant="line" className="h-auto w-full justify-start gap-8 rounded-none border-b border-border p-0">
          <TabsTrigger value="details" className="flex-none rounded-none px-0 py-3 text-sm text-muted-foreground after:bg-primary data-active:text-primary">Detalhes do NFT</TabsTrigger>
          <TabsTrigger value="reviews" className="flex-none rounded-none px-0 py-3 text-sm text-muted-foreground after:bg-primary data-active:text-primary">Avaliações</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-5 pt-6 text-sm leading-6 text-muted-foreground">
          <p>Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.</p>
          <p>A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.</p>
          <div className="space-y-4 pt-2">
            <p><span className="font-semibold text-foreground">Rede</span><br />Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS</p>
            <p><span className="font-semibold text-foreground">Contrato:</span><br />Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.</p>
            <p><span className="font-semibold text-foreground">Direitos autorais:</span><br />0x7A42...19E8 • Contrato inteligente ERC-721 verificado.</p>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="pt-6">
          <Card className="rounded-xl border-border bg-card p-5 shadow-none">
            <CardContent className="p-0">
              <h2 className="text-sm font-semibold text-foreground">Avaliações de colecionadores</h2>
              <p className="mt-2 text-sm text-muted-foreground">As avaliações de clientes para este NFT serão exibidas aqui.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <RelatedProducts title="Mais destaques" />
    </main>
  )
}

export function CartPage() {
  return <main className="py-8 md:py-12"><PageHeading>Carrinho de NFTs</PageHeading><div className="grid gap-7 lg:grid-cols-[1fr_340px]"><section className="space-y-3"><div className="hidden grid-cols-[1fr_90px_100px_90px_30px] gap-3 border-b border-border pb-3 text-xs md:grid"><span>NFTs</span><span>Preço</span><span>Edições</span><span>Total</span><span /></div>{items.map((item) => <Card key={item.name} className="gap-0 rounded-xl border-0 bg-card p-0 shadow-none"><CardContent className="flex items-center gap-3 p-0 md:p-2"><img src={item.image} alt={item.name} className="size-24 rounded-l-xl object-cover md:size-16 md:rounded" /><div className="min-w-0 flex-1"><h2 className="text-xs font-bold">{item.name}</h2><p className="mt-1 text-xs text-muted-foreground">Edição: {item.edition}</p><p className="mt-2 text-sm font-bold text-primary">{item.price} ETH</p></div><div className="flex items-center gap-2"><Button variant="secondary" size="icon-xs" className="rounded-full" aria-label="Diminuir"><MinusIcon /></Button><span className="text-xs">1</span><Button variant="secondary" size="icon-xs" className="rounded-full" aria-label="Aumentar"><PlusIcon /></Button></div><Button variant="ghost" size="icon-sm" aria-label={`Remover ${item.name}`}><Trash2Icon /></Button></CardContent></Card>)}</section><Card className="h-fit rounded-2xl border-0 bg-card p-5 shadow-none"><CardContent className="space-y-4 p-0"><h2 className="hidden text-sm font-semibold md:block">Resumo da carteira</h2><div className="flex gap-2"><Input placeholder="Digite o código promocional..." className="h-10 rounded-full text-xs" /><Button className="h-10 rounded-full">Aplicar</Button></div><div className="space-y-3 text-xs"><p className="flex justify-between"><span>Subtotal</span><span>8.92 ETH</span></p><p className="flex justify-between"><span>Desconto do lançamento</span><span>(−) 00.00</span></p><p className="flex justify-between"><span>Taxa de rede</span><span>0.016 ETH</span></p><p className="flex justify-between text-sm font-bold"><span>Total</span><span className="text-primary">8.936 ETH</span></p></div><Button render={<a href="/pagamento" />} className="h-12 w-full rounded-full">Conectar e finalizar</Button></CardContent></Card></div><RelatedProducts title="Colecionadores também viram" /></main>
}

export function PaymentPage() {
  return <main className="mx-auto min-h-[80vh] w-full py-8 md:py-12"><PageHeading>Pagamento com carteira</PageHeading><div className="grid gap-8 md:grid-cols-2"><section><div className="flex justify-between"><h2 className="text-sm font-semibold">Carteira conectada</h2><Button render={<a href="/carteiras" />} variant="link" className="h-auto p-0 text-xs">Trocar carteira</Button></div><RadioGroup defaultValue="reserva" className="mt-4 space-y-3">{[{value:'reserva',name:'Reserva',detail:'nova.kurio.eth',network:'Rede Polygon'}, {value:'principal',name:'Principal',detail:'0xA91F…E82C',network:'Rede principal Ethereum'}].map((wallet) => <Label key={wallet.value} className="flex cursor-pointer items-center gap-4 rounded-xl bg-card p-4"><RadioGroupItem value={wallet.value} /><span className="space-y-1"><strong className="block text-sm">{wallet.name}</strong><span className="block text-xs text-muted-foreground">{wallet.detail}<br />{wallet.network}</span></span></Label>)}</RadioGroup></section><section><h2 className="text-sm font-semibold">Carteira e rede</h2><RadioGroup defaultValue="coinbase" className="mt-4 space-y-3">{['WalletConnect','MetaMask','Coinbase Wallet'].map((name) => <Label key={name} className="flex cursor-pointer items-center justify-between rounded-xl bg-card p-4"><span className="flex items-center gap-3 text-xs"><WalletIcon className="size-5 text-primary" />{name}</span><RadioGroupItem value={name === 'Coinbase Wallet' ? 'coinbase' : name} /></Label>)}</RadioGroup><p className="mt-5 text-right text-sm font-bold">Total: <span className="ml-4 text-primary">8.936 ETH</span></p><Button className="mt-10 h-12 w-full rounded-full">Confirmar compra</Button></section></div></main>
}

export function AuthPage({ register = false }: { register?: boolean }) {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const title = register ? 'Criar perfil de colecionador' : 'Entrar'

  if (isMobile) {
    return <main className="mx-auto w-full max-w-md"><AuthForm register={register} /></main>
  }

  return (
    <>
      <HomePage />
      <Dialog open onOpenChange={(open) => { if (!open) void navigate({ to: '/' }) }}>
        <DialogContent className="max-h-[calc(100vh-2rem)] max-w-md overflow-y-auto bg-background p-0" overlayClassName="bg-black/65">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">Acesse sua conta ou crie um perfil de colecionador.</DialogDescription>
          <AuthForm register={register} />
        </DialogContent>
      </Dialog>
    </>
  )
}

function AuthForm({ register }: { register: boolean }) {
  return (
    <Card className="flex min-h-[85vh] w-full flex-col justify-center gap-0 rounded-none bg-transparent py-10 ring-0 md:min-h-0 md:rounded-lg md:p-8">
      <Button render={<a href="/" />} variant="ghost" className="h-auto p-0 text-3xl font-bold tracking-[0.15em] hover:bg-transparent">KURIO</Button>
      <h1 className="mt-16 text-center text-lg font-semibold md:mt-8">{register ? 'Criar perfil de colecionador' : 'Entrar'}</h1>
      <form className="mt-8 space-y-3" onSubmit={(event) => event.preventDefault()}>
        {register && <Input aria-label="Nome de usuário" placeholder="Nome de usuário" className="h-12" />}
        <Input type="email" aria-label="E-mail" placeholder="Digite seu e-mail" className="h-12" />
        <Input type="password" aria-label="Senha" placeholder="Senha" className="h-12" />
        {register && <Input type="password" aria-label="Confirmar senha" placeholder="Confirmar senha" className="h-12" />}
        {!register && <p className="text-right text-xs text-primary">Esqueceu a senha?</p>}
        <Button type="submit" className="mt-6 h-14 w-full">{register ? 'Criar perfil' : 'Entrar'}</Button>
      </form>
      <div className="mt-10 flex items-center gap-3 text-xs"><span className="h-px flex-1 bg-border" />Ou continue com<span className="h-px flex-1 bg-border" /></div>
      <div className="mt-4 grid gap-3"><Button variant="outline" className="h-10">Continuar com Google</Button><Button variant="outline" className="h-10">Continuar com Facebook</Button></div>
      <p className="mt-10 text-center text-xs text-muted-foreground">{register ? 'Já tem uma conta?' : 'Novo na Kurio?'} <Button render={<a href={register ? '/entrar' : '/cadastro'} />} variant="link" className="h-auto p-0 text-xs font-normal text-foreground">{register ? 'Entre' : 'Crie uma conta'}</Button></p>
    </Card>
  )
}

const accountLinks = [{label:'Dados do perfil',href:'/perfil',icon:UserRoundIcon},{label:'Carteiras',href:'/carteiras',icon:WalletIcon},{label:'Atividade',href:'#',icon:ShoppingCartIcon},{label:'Lista de interesse',href:'#',icon:HeartIcon},{label:'Sair',href:'/',icon:LogOutIcon}]

export function AccountPage({ wallets = false }: { wallets?: boolean }) {
  const fields = wallets ? ['Nome de exibição','Apelido da carteira','Rede','Nome do perfil','Endereço da carteira','Tipo de carteira','E-mail','Nome ENS'] : ['Nome de exibição','Nome de usuário','E-mail','Nome ENS','Apelido da carteira']
  return <main className="grid min-h-[70vh] gap-6 py-8 md:grid-cols-[220px_1fr]"><aside><Card className="h-fit gap-0 rounded-lg bg-card p-4 ring-0"><h1 className="mb-4 text-sm font-bold">Meu perfil</h1><nav className="flex flex-wrap gap-3 md:flex-col">{accountLinks.map(({label,href,icon:Icon}) => <Button key={label} render={<a href={href} />} variant="ghost" className="h-auto justify-start gap-2 p-0 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-primary"><Icon className="size-4" />{label}</Button>)}</nav></Card></aside><section><h2 className="text-sm font-semibold">{wallets ? 'Carteira principal' : 'Perfil do colecionador'}</h2>{wallets && <p className="mt-2 text-xs text-muted-foreground">Estas carteiras ficam disponíveis no pagamento e para receber NFTs.</p>}<form className="mt-6" onSubmit={(event) => event.preventDefault()}><div className="grid gap-5 sm:grid-cols-2">{fields.map((field) => <div key={field} className="space-y-2"><Label htmlFor={field} className="text-xs">{field} <span className="text-destructive">*</span></Label><Input id={field} className="h-10 rounded-sm" /></div>)}</div>{!wallets && <div className="mt-8 max-w-sm space-y-4"><h3 className="text-sm font-semibold">Alterar senha</h3>{['Senha atual','Nova senha','Confirmar nova senha'].map((field) => <div key={field} className="space-y-2"><Label htmlFor={field} className="text-xs">{field}</Label><Input id={field} type="password" className="h-10 rounded-sm" /></div>)}</div>}<Button className="mt-6">{wallets ? 'Salvar carteira' : 'Salvar'}</Button></form>{wallets && <div className="mt-8"><h3 className="text-sm font-semibold">Carteira secundária</h3><p className="mt-2 text-xs text-muted-foreground">Você ainda não adicionou uma carteira secundária.</p></div>}</section></main>
}
