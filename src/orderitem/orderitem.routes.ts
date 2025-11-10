import {Hono} from 'hono'
import * as OrderItemControllers from './orderitem.controllers.ts'
import { adminRoleAuth } from '../middleware/bearAuth.ts'


const OrderItemRoutes = new Hono()



// Get all OrderItem
OrderItemRoutes.get('/OrderItem',  OrderItemControllers.getAllOrderItems)

// Get user by OrderItem id
OrderItemRoutes.get('/OrderItem/:order_item_id', OrderItemControllers.getOrderItemById)

 // Create a OrderItem 
OrderItemRoutes.post('/OrderItem', OrderItemControllers.createOrderItem)

// Update OrderItem  by OrderItem id
OrderItemRoutes.put('/OrderItem/:order_item_id', OrderItemControllers.updateOrderItem)

// Delete OrderItem by OrderItem id
OrderItemRoutes.delete('/OrderItem/:order_item_id', OrderItemControllers.deleteOrderItem)



export default OrderItemRoutes