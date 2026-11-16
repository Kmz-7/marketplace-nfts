export interface ReviewContract {
  id: string
  nftId: string
  userId: string
  userName: string
  userAvatarUrl: string
  rating: number
  comment: string
  createdAt: string
}

export interface NftReviewsContract {
  nftId: string
  items: ReviewContract[]
  total: number
  averageRating: number
}
