import { getDbPool } from "../db/db.config.ts";


// Interfaces

interface OrderInfo {
  order_id: number;
  restaurant_id: number;
  customer_id: number;
  order_type: string;
  status: string;
  total_amount: number;
  created_at?: Date;
}

interface MenuItemInfo {
  menu_item_id: number;
  restaurant_id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  is_available?: boolean;
}

export interface OrderItemResponse {
  order_item_id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;

  order: OrderInfo;
  menu_item: MenuItemInfo;
}


// GET ALL ORDER ITEMS (with JOIN)

export const getAllOrderItems = async (): Promise<OrderItemResponse[]> => {
  const db = await getDbPool();

  const query = `
    SELECT 
      oi.order_item_id,
      oi.order_id,
      oi.menu_item_id,
      oi.quantity,
      oi.unit_price,
      oi.total_price,

      -- Order details
      o.restaurant_id AS order_restaurant_id,
      o.customer_id AS order_customer_id,
      o.order_type,
      o.status AS order_status,
      o.total_amount AS order_total_amount,
      o.created_at AS order_created_at,

      -- Menu item details
      m.restaurant_id AS menu_restaurant_id,
      m.category_id AS menu_category_id,
      m.name AS menu_name,
      m.description AS menu_description,
      m.price AS menu_price,
      m.is_available AS menu_is_available

    FROM OrderItems oi
    INNER JOIN Orders o ON oi.order_id = o.order_id
    INNER JOIN MenuItems m ON oi.menu_item_id = m.menu_item_id
    ORDER BY oi.order_item_id DESC
  `;

  const result = await db.request().query(query);

  return result.recordset.map((row: any) => ({
    order_item_id: row.order_item_id,
    order_id: row.order_id,
    menu_item_id: row.menu_item_id,
    quantity: row.quantity,
    unit_price: row.unit_price,
    total_price: row.total_price,

    order: {
      order_id: row.order_id,
      restaurant_id: row.order_restaurant_id,
      customer_id: row.order_customer_id,
      order_type: row.order_type,
      status: row.order_status,
      total_amount: row.order_total_amount,
      created_at: row.order_created_at,
    },

    menu_item: {
      menu_item_id: row.menu_item_id,
      restaurant_id: row.menu_restaurant_id,
      category_id: row.menu_category_id,
      name: row.menu_name,
      description: row.menu_description,
      price: row.menu_price,
      is_available: row.menu_is_available,
    },
  }));
};


// GET SINGLE ORDER ITEM BY ID

export const getOrderItemById = async (order_item_id: number): Promise<OrderItemResponse | null> => {
  const db = await getDbPool();

  const query = `
    SELECT 
      oi.order_item_id,
      oi.order_id,
      oi.menu_item_id,
      oi.quantity,
      oi.unit_price,
      oi.total_price,

      -- Order details
      o.restaurant_id AS order_restaurant_id,
      o.customer_id AS order_customer_id,
      o.order_type,
      o.status AS order_status,
      o.total_amount AS order_total_amount,
      o.created_at AS order_created_at,

      -- Menu item details
      m.restaurant_id AS menu_restaurant_id,
      m.category_id AS menu_category_id,
      m.name AS menu_name,
      m.description AS menu_description,
      m.price AS menu_price,
      m.is_available AS menu_is_available

    FROM OrderItems oi
    INNER JOIN Orders o ON oi.order_id = o.order_id
    INNER JOIN MenuItems m ON oi.menu_item_id = m.menu_item_id
    WHERE oi.order_item_id = @order_item_id
  `;

  const result = await db.request()
    .input("order_item_id", order_item_id)
    .query(query);

  if (!result.recordset.length) return null;

  const row = result.recordset[0];

  return {
    order_item_id: row.order_item_id,
    order_id: row.order_id,
    menu_item_id: row.menu_item_id,
    quantity: row.quantity,
    unit_price: row.unit_price,
    total_price: row.total_price,

    order: {
      order_id: row.order_id,
      restaurant_id: row.order_restaurant_id,
      customer_id: row.order_customer_id,
      order_type: row.order_type,
      status: row.order_status,
      total_amount: row.order_total_amount,
      created_at: row.order_created_at,
    },

    menu_item: {
      menu_item_id: row.menu_item_id,
      restaurant_id: row.menu_restaurant_id,
      category_id: row.menu_category_id,
      name: row.menu_name,
      description: row.menu_description,
      price: row.menu_price,
      is_available: row.menu_is_available,
    },
  };
};


// CREATE ORDER ITEM

export const createOrderItem = async (data: {
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}): Promise<string> => {
  const db = await getDbPool();

  const query = `
    INSERT INTO OrderItems (order_id, menu_item_id, quantity, unit_price, total_price)
    VALUES (@order_id, @menu_item_id, @quantity, @unit_price, @total_price)
  `;

  const result = await db.request()
    .input("order_id", data.order_id)
    .input("menu_item_id", data.menu_item_id)
    .input("quantity", data.quantity)
    .input("unit_price", data.unit_price)
    .input("total_price", data.total_price)
    .query(query);

  return result.rowsAffected[0] === 1
    ? "Order item created successfully ✅"
    : "Failed to create order item ❌";
};


// UPDATE ORDER ITEM

export const updateOrderItem = async (
  order_item_id: number,
  data: {
    order_id: number;
    menu_item_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
  }
): Promise<OrderItemResponse | null> => {
  const db = await getDbPool();

  const query = `
    UPDATE OrderItems
    SET 
      order_id = @order_id,
      menu_item_id = @menu_item_id,
      quantity = @quantity,
      unit_price = @unit_price,
      total_price = @total_price
    WHERE order_item_id = @order_item_id
  `;

  await db.request()
    .input("order_item_id", order_item_id)
    .input("order_id", data.order_id)
    .input("menu_item_id", data.menu_item_id)
    .input("quantity", data.quantity)
    .input("unit_price", data.unit_price)
    .input("total_price", data.total_price)
    .query(query);

  return await getOrderItemById(order_item_id);
};


// DELETE ORDER ITEM

export const deleteOrderItem = async (order_item_id: number): Promise<string> => {
  const db = await getDbPool();

  const query = "DELETE FROM OrderItems WHERE order_item_id = @order_item_id";

  const result = await db.request()
    .input("order_item_id", order_item_id)
    .query(query);

  return result.rowsAffected[0] === 1
    ? "Order item deleted successfully 🗑️"
    : "Failed to delete order item ⚠️";
};
