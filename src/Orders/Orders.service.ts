
import { getDbPool } from "src/db/db.config.ts";

//  Interfaces
interface RestaurantInfo {
    restaurant_id: number;
    name: string;
    address?: string;
    city?: string;
    phone_number?: string;
    email?: string;
}

interface CustomerInfo {
    customer_id: number;
    name: string;
    email?: string;
    phone_number?: string;
}

interface OrderResponse {
    order_id: number;
    order_type: string;
    status: string;
    total_amount: number;
    created_at?: Date;

    restaurant: RestaurantInfo;
    customer: CustomerInfo;
}

//  GET ALL ORDERS 
export const getAllOrders = async (): Promise<OrderResponse[]> => {
    const db = getDbPool();

    const query = `
        SELECT 
            o.order_id,
            o.restaurant_id,
            o.customer_id,
            o.order_type,
            o.status,
            o.total_amount,
            o.created_at,

            r.name AS restaurant_name,
            r.address AS restaurant_address,
            r.city AS restaurant_city,
            r.phone_number AS restaurant_phone,
            r.email AS restaurant_email,

            (u.first_name + ' ' + u.last_name) AS customer_name,
            u.email AS customer_email,
            u.phone_number AS customer_phone

        FROM Orders o
        INNER JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
        INNER JOIN Users u ON o.customer_id = u.user_id
        ORDER BY o.created_at DESC
    `;

    const result = await db.request().query(query);

    return result.recordset.map(row => ({
        order_id: row.order_id,
        order_type: row.order_type,
        status: row.status,
        total_amount: row.total_amount,
        created_at: row.created_at,

        restaurant: {
            restaurant_id: row.restaurant_id,
            name: row.restaurant_name,
            address: row.restaurant_address,
            city: row.restaurant_city,
            phone_number: row.restaurant_phone,
            email: row.restaurant_email
        },

        customer: {
            customer_id: row.customer_id,
            name: row.customer_name,
            email: row.customer_email,
            phone_number: row.customer_phone
        }
    }));
};

// GET SINGLE ORDER BY ID 
export const getOrderById = async (order_id: number): Promise<OrderResponse | null> => {
    const db = getDbPool();

    const query = `
        SELECT 
            o.order_id,
            o.restaurant_id,
            o.customer_id,
            o.order_type,
            o.status,
            o.total_amount,
            o.created_at,

            r.name AS restaurant_name,
            r.address AS restaurant_address,
            r.city AS restaurant_city,
            r.phone_number AS restaurant_phone,
            r.email AS restaurant_email,

            (u.first_name + ' ' + u.last_name) AS customer_name,
            u.email AS customer_email,
            u.phone_number AS customer_phone

        FROM Orders o
        INNER JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
        INNER JOIN Users u ON o.customer_id = u.user_id
        WHERE o.order_id = @order_id
    `;

    const result = await db.request()
        .input("order_id", order_id)
        .query(query);

    if (!result.recordset.length) return null;

    const row = result.recordset[0];

    return {
        order_id: row.order_id,
        order_type: row.order_type,
        status: row.status,
        total_amount: row.total_amount,
        created_at: row.created_at,

        restaurant: {
            restaurant_id: row.restaurant_id,
            name: row.restaurant_name,
            address: row.restaurant_address,
            city: row.restaurant_city,
            phone_number: row.restaurant_phone,
            email: row.restaurant_email
        },

        customer: {
            customer_id: row.customer_id,
            name: row.customer_name,
            email: row.customer_email,
            phone_number: row.customer_phone
        }
    };
};

// ✅ CREATE ORDER
export const createOrder = async (
    restaurant_id: number,
    customer_id: number,
    order_type: string,
    status: string,
    total_amount: number
): Promise<string> => {
    const db = getDbPool();

    const query = `
        INSERT INTO Orders (restaurant_id, customer_id, order_type, status, total_amount)
        VALUES (@restaurant_id, @customer_id, @order_type, @status, @total_amount)
    `;

    const result = await db.request()
        .input("restaurant_id", restaurant_id)
        .input("customer_id", customer_id)
        .input("order_type", order_type)
        .input("status", status)
        .input("total_amount", total_amount)
        .query(query);

    return result.rowsAffected[0] === 1
        ? "Order created successfully 🎉"
        : "Failed to create order";
};

// ✅ UPDATE ORDER
export const updateOrder = async (
    order_id: number,
    restaurant_id: number,
    customer_id: number,
    order_type: string,
    status: string,
    total_amount: number
): Promise<OrderResponse | null> => {
    const db = getDbPool();

    const query = `
        UPDATE Orders 
        SET restaurant_id=@restaurant_id,
            customer_id=@customer_id,
            order_type=@order_type,
            status=@status,
            total_amount=@total_amount
        WHERE order_id=@order_id
    `;

    await db.request()
        .input("order_id", order_id)
        .input("restaurant_id", restaurant_id)
        .input("customer_id", customer_id)
        .input("order_type", order_type)
        .input("status", status)
        .input("total_amount", total_amount)
        .query(query);

    return await getOrderById(order_id);
};

// ✅ DELETE ORDER
export const deleteOrder = async (order_id: number): Promise<string> => {
    const db = getDbPool();

    const query = "DELETE FROM Orders WHERE order_id=@order_id";

    const result = await db.request()
        .input("order_id", order_id)
        .query(query);

    return result.rowsAffected[0] === 1
        ? "Order deleted successfully 🎊"
        : "Failed to delete order";
};
