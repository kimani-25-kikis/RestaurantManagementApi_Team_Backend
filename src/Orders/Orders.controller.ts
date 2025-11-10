import { type Context } from "hono";
import * as OrdersServices from "./Orders.service.ts";

// ✅ GET ALL ORDERS
export const getAllOrders = async (c: Context) => {
    try {
        const result = await OrdersServices.getAllOrders();

        if (result.length === 0) {
            return c.json({ message: 'No Order found' }, 404);
        }

        return c.json(result);

    } catch (error: any) {
        console.log('Error fetching Orders:', error.message);
        return c.json({ error: 'Failed to fetch Orders' }, 500);
    }
};

// ✅ GET ORDER BY ID
export const getOrderById = async (c: Context) => {
    const order_id = parseInt(c.req.param('order_id'));

    try {
        const result = await OrdersServices.getOdersById(order_id);

        if (result === null) {
            return c.json({ error: 'Order not found' }, 404);
        }

        return c.json(result);

    } catch (error) {
        console.log('Error fetching Order:', error);
        return c.json({ error: 'internal server error' }, 500);
    }
};

// ✅ CREATE ORDER
export const createOrder = async (c: Context) => {
    try {
        const body = await c.req.json();

        const { restaurant_id, customer_id, order_type, status, total_amount } = body;

        if (!restaurant_id || !customer_id || !order_type || !status || !total_amount) {
            return c.json({ error: "All fields are required" }, 400);
        }

        const message = await OrdersServices.createOrder(
            restaurant_id,
            customer_id,
            order_type,
            status,
            total_amount
        );

        return c.json({ message }, 201);

    } catch (error) {
        console.log("Error creating Order:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};

// ✅ UPDATE ORDER
export const updateOrder = async (c: Context) => {
    try {
        const order_id = parseInt(c.req.param('order_id'));
        const body = await c.req.json();

        const checkExists = await OrdersServices.getOdersById(order_id);

        if (checkExists === null) {
            return c.json({ error: 'Order not found' }, 404);
        }

        const result = await OrdersServices.updateOrder(
            order_id,
            body.restaurant_id,
            body.customer_id,
            body.order_type,
            body.status,
            body.total_amount
        );

        return c.json({ message: 'Order updated successfully', updated_Order: result }, 200);

    } catch (error) {
        console.log('Error updating Order:', error);
        return c.json({ error: 'internal server error' }, 500);
    }
};

// ✅ DELETE ORDER
export const deleteOrder = async (c: Context) => {
    const order_id = parseInt(c.req.param('order_id'));

    try {
        const check = await OrdersServices.getOdersById(order_id);

        if (check === null) {
            return c.json({ error: 'Order not found' }, 404);
        }

        const result = await OrdersServices.deleteorder(order_id);

        return c.json({ message: 'Order deleted successfully', deleted_Order: result }, 200);

    } catch (error) {
        console.log('Error deleting Order:', error);
        return c.json({ error: 'internal server error' }, 500);
    }
};
