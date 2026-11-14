import { forwardRef } from 'react'
import {
  Add,
  ArrowDown2,
  ArrowLeft2,
  ArrowRight2,
  ArrowUp2,
  Camera,
  Check,
  CloseCircle,
  Danger,
  HambergerMenu,
  Heart,
  Home,
  InfoCircle,
  Logout,
  Menu,
  Minus,
  More,
  Play,
  Refresh,
  Scan,
  SearchNormal1,
  Setting4,
  ShoppingCart,
  SidebarLeft,
  Star1,
  TickCircle,
  Trash,
  User,
  Wallet,
  Warning2,
  type Icon as IconsaxIcon,
  type IconProps,
} from 'iconsax-react'

function createIcon(Icon: IconsaxIcon, defaultClassName = '') {
  return forwardRef<SVGSVGElement, IconProps>(function IconsaxIconWrapper({ className, color = 'currentColor', variant = 'Linear', ...props }, ref) {
    return <Icon ref={ref} color={color} variant={variant} className={[defaultClassName, className].filter(Boolean).join(' ')} {...props} />
  })
}

export const ArrowRightIcon = createIcon(ArrowRight2)
export const ArrowLeftIcon = createIcon(ArrowLeft2)
export const ChevronRightIcon = createIcon(ArrowRight2)
export const ChevronLeftIcon = createIcon(ArrowLeft2)
export const ChevronDownIcon = createIcon(ArrowDown2)
export const ChevronUpIcon = createIcon(ArrowUp2)
export const CheckIcon = createIcon(Check)
export const CircleCheckIcon = createIcon(TickCircle)
export const InfoIcon = createIcon(InfoCircle)
export const TriangleAlertIcon = createIcon(Warning2)
export const OctagonXIcon = createIcon(CloseCircle)
export const Loader2Icon = createIcon(Refresh)
export const MoreHorizontalIcon = createIcon(More)
export const PanelLeftIcon = createIcon(SidebarLeft)
export const XIcon = createIcon(Add, 'rotate-45')
export const CameraIcon = createIcon(Camera)
export const PlayIcon = createIcon(Play)
export const MenuIcon = createIcon(Menu)
export const HambergerMenuIcon = createIcon(HambergerMenu)
export const HeartIcon = createIcon(Heart)
export const HomeIcon = createIcon(Home)
export const ScanLineIcon = createIcon(Scan)
export const SearchIcon = createIcon(SearchNormal1)
export const ShoppingCartIcon = createIcon(ShoppingCart)
export const SlidersHorizontalIcon = createIcon(Setting4)
export const UserRoundIcon = createIcon(User)
export const LogOutIcon = createIcon(Logout)
export const MinusIcon = createIcon(Minus)
export const PlusIcon = createIcon(Add)
export const StarIcon = createIcon(Star1)
export const Trash2Icon = createIcon(Trash)
export const WalletIcon = createIcon(Wallet)
export const AlertIcon = createIcon(Danger)
