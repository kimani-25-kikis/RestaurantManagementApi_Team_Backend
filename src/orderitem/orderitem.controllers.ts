import type { Context } from "hono";
import * as orderItemService from "../orderitem/orderitem.services.ts";

// ✅ Get all order items
export const getAllOrderItems = async (c: Context) => {
  try {
    const items = await orderItemService.getAllOrderItems();
    return c.json(items, 200);
  } catch (error: any) {
    console.error("Error fetching order items:", error.message);
    return c.json({ error: "Failed to fetch order items" }, 500);
  }
};

// ✅ Get order item by ID
export const getOrderItemById = async (c: Context) => {
  const id = Number(c.req.param("order_item_id"));
  if (isNaN(id)) return c.json({ error: "Invalid order item ID" }, 400);

  try {
    const item = await orderItemService.getOrderItemById(id);
    if (!item) return c.json({ error: "Order item not found" }, 404);
    return c.json(item, 200);
  } catch (error: any) {
    console.error("Error fetching order item:", error.message);
    return c.json({ error: "Failed to fetch order item" }, 500);
  }
};

// ✅ Create order item
export const createOrderItem = async (c: Context) => {
  try {
    const data = await c.req.json();
    const created = await orderItemService.createOrderItem(data);
    return c.json({ message: "Order item created successfully", order_item: created }, 201);
  } catch (error: any) {
    console.error("Error creating order item:", error.message);
    return c.json({ error: error.message || "Failed to create order item" }, 500);
  }
};

// ✅ Update order item
export const updateOrderItem = async (c: Context) => {
  const id = Number(c.req.param("order_item_id"));
  if (isNaN(id)) return c.json({ error: "Invalid order item ID" }, 400);

  try {
    const data = await c.req.json();
    const updated = await orderItemService.updateOrderItem(id, data);
    if (!updated) return c.json({ error: "Order item not found" }, 404);
    return c.json({ message: "Order item updated successfully" }, 200);
  } catch (error: any) {
    console.error("Error updating order item:", error.message);
    return c.json({ error: "Failed to update order item" }, 500);
  }
};

// ✅ Delete order item
export const deleteOrderItem = async (c: Context) => {
  const id = Number(c.req.param("order_item_id"));
  if (isNaN(id)) return c.json({ error: "Invalid order item ID" }, 400);

  try {
    const deleted = await orderItemService.deleteOrderItem(id);
    if (!deleted) return c.json({ error: "Order item not found" }, 404);
    return c.json({ message: "Order item deleted successfully" }, 200);
  } catch (error: any) {
    console.error("Error deleting order item:", error.message);
    return c.json({ error: "Failed to delete order item" }, 500);
  }
};
