import { orderHandlers } from './order.handlers'
import { nftHandlers } from './nft.handlers'
import { socketHandlers } from './socket.handlers'
import { userHandlers } from './user.handlers'

export const handlers = [...userHandlers, ...orderHandlers, ...nftHandlers, ...socketHandlers]
