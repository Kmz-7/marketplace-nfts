import { Button } from '@/components/ui/button'
import { SearchIcon } from '@/components/ui/icons'
import { Skeleton } from '@/components/ui/skeleton'

type NftGalleryProps = {
  gallery: string[]
  selectedImage: string
  isImageLoading: boolean
  onSelectImage: (image: string) => void
  onOpenFullscreen: () => void
}

export function NftGallery({
  gallery,
  selectedImage,
  isImageLoading,
  onSelectImage,
  onOpenFullscreen,
}: NftGalleryProps) {
  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      <div className="grid grid-cols-4 gap-2 md:flex md:w-[18%] md:flex-col md:justify-between">
        {gallery.map((image, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            aria-label={`Ver imagem ${index + 1} do NFT`}
            aria-pressed={selectedImage === image && index === 0}
            onClick={() => onSelectImage(image)}
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
      <div className="relative flex aspect-square min-w-0 flex-1 items-center justify-center overflow-hidden rounded-lg bg-card p-5">
        {isImageLoading ? (
          <Skeleton className="h-full w-full rounded-[15px]" />
        ) : (
          <img
            src={selectedImage}
            alt="Emerald Ape #042"
            className="h-full w-full rounded-[15px] object-cover"
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
          <SearchIcon className="size-5" />
        </Button>
      </div>
    </div>
  )
}
