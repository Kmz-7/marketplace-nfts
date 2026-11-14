import { orderHandlers } from './order.handlers'
import { userHandlers } from './user.handlers'

export const handlers = [...userHandlers, ...orderHandlers]
