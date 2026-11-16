import { orderHandlers } from './order.handlers'
import { cartHandlers } from './cart.handlers'
import { nftHandlers } from './nft.handlers'
import { reviewHandlers } from './review.handlers'
import { socketHandlers } from './socket.handlers'
import { userHandlers } from './user.handlers'

export const handlers = [
  ...userHandlers,
  ...cartHandlers,
  ...orderHandlers,
  ...reviewHandlers,
  ...nftHandlers,
  ...socketHandlers,
]
