import { Button } from '@/components/ui/button'
import { ZoomIn } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { marketplaceImageSrcSet } from '@/lib/responsive-image'

type NftGalleryProps = {
  gallery: string[]
  selectedImage: string
  selectedImageIndex: number
  nftName: string
  isImageLoading: boolean
  onSelectImage: (index: number) => void
  onOpenFullscreen: () => void
}

export function NftGallery({
  gallery,
  selectedImage,
  selectedImageIndex,
  nftName,
  isImageLoading,
  onSelectImage,
  onOpenFullscreen,
}: NftGalleryProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      {/* No Figma, as miniaturas pareciam apenas decorativas; clicar em qualquer uma agora troca a seleção, mesmo quando a arte é igual, e mostra o estado de carregamento. */}
      <div className="hidden grid-cols-4 gap-2 md:flex md:w-[18%] md:flex-col md:justify-between">
        {gallery.map((image, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            aria-label={`Ver imagem ${index + 1} do NFT`}
            aria-pressed={selectedImageIndex === index}
            onClick={() => onSelectImage(index)}
            className={`h-auto w-full rounded-lg border p-0 hover:bg-transparent md:min-h-0 md:flex-1 ${selectedImage === image ? 'border-primary' : 'border-transparent'}`}
          >
            <img
              src={image}
              alt=""
              className="aspect-square w-full rounded-md object-cover md:aspect-auto md:h-full"
            />
          </Button>
        ))}
      </div>
      <div className="relative flex aspect-square min-w-0 flex-1 items-center justify-center overflow-hidden rounded-3xl bg-transparent p-0 md:rounded-lg md:bg-card md:p-5">
        {isImageLoading ? (
          <Skeleton className="h-full w-full rounded-[15px]" />
        ) : (
          <img
            src={selectedImage}
            srcSet={marketplaceImageSrcSet(selectedImage)}
            sizes="(max-width: 767px) 32vw, 50vw"
            alt={nftName}
            className="image-standard h-full w-full rounded-3xl md:rounded-[15px]"
            fetchPriority="high"
            decoding="async"
          />
        )}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Ampliar imagem para tela cheia"
          onClick={onOpenFullscreen}
          className="absolute top-2 right-2 z-10 rounded-full border border-card bg-card text-foreground hover:bg-card/90 hover:text-foreground"
        >
          {/* No Figma, a lupa deste controle destoava das demais ações; os ícones comuns usam size-4. */}
          <ZoomIn className="size-4" />
        </Button>
      </div>
    </div>
  )
}
