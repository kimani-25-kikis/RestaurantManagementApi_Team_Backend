import { Hono } from 'hono';
import * as OrderControllers from './Orders.controller.ts';

const OrdersRoutes = new Hono();

//CREATE ORDER
OrdersRoutes.post('/orders', OrderControllers.createOrder);

//GET ALL ORDERS
OrdersRoutes.get('/orders', OrderControllers.getAllOrders);

//GET ORDER BY ID
OrdersRoutes.get('/orders/:order_id', OrderControllers.getOrderById);

//UPDATE ORDER
OrdersRoutes.put('/orders/:order_id', OrderControllers.updateOrder);

//DELETE ORDER
OrdersRoutes.delete('/orders/:order_id', OrderControllers.deleteOrder);

export default OrdersRoutes;
