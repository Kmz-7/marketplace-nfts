import { Link } from '@tanstack/react-router'
import { HeartIcon } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

interface HomeNftCardProps {
  name: string
  creator: string
  image: string
  price: string
  previousPrice?: string
  imageOnly?: boolean
}

export function HomeNftCard({ name, image, price, previousPrice, imageOnly = false }: HomeNftCardProps) {
  return (
    <Card className="group relative min-w-0 gap-0 overflow-visible rounded-none bg-transparent p-0 text-foreground ring-0">
      <Button
        render={<Link to="/nft" />}
        variant="ghost"
        aria-label={`Ver detalhes de ${name}`}
        className="absolute inset-0 z-10 h-full w-full rounded-none p-0 hover:bg-transparent focus-visible:ring-inset dark:hover:bg-transparent"
      />
      <Card className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[20px] bg-transparent p-0 ring-0 md:aspect-[258/300] md:rounded-none">
        <CardContent className="flex h-full w-full items-center justify-center bg-card p-0 md:relative md:top-2 md:h-[calc(100%-8px)] md:w-[calc(100%-8px)]">
          <img src={image} alt={name} className="aspect-square w-full rounded-[15px] object-cover" />
        </CardContent>
        {!imageOnly && <Button variant="secondary" size="icon-sm" aria-label={`Favoritar ${name}`} className="absolute top-2 right-2 z-20 size-8 rounded-full transition-opacity md:opacity-0 group-hover:opacity-100 focus-visible:opacity-100"><HeartIcon /></Button>}
      </Card>
      {!imageOnly && <CardContent className="mt-2 flex flex-col items-start gap-1 p-0">
        <CardTitle className="max-w-full truncate text-xs font-medium"><h3>{name}</h3></CardTitle>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-primary">{price} ETH</p>
          {previousPrice && <p className="text-sm font-semibold text-muted-foreground">{previousPrice} ETH</p>}
        </div>
      </CardContent>}
    </Card>
  )
}
