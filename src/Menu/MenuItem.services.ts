import { getDbPool } from "../db/db.config.ts";

// Interfaces
interface RestaurantInfo {
  restaurant_id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  phone_number?: string;
  email?: string;
  cuisine_type?: string;
}

interface CategoryInfo {
  category_id: number;
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface MenuItemResponse {
  menu_item_id: number;
  name: string;
  description?: string;
  price: number;
  is_available: boolean;
  created_at?: Date;

  restaurant: RestaurantInfo;
  category: CategoryInfo;
}

// GET ALL MENU ITEMS
export const getAllMenuItems = async (): Promise<MenuItemResponse[]> => {
  const db = await getDbPool();

  const query = `
    SELECT 
      m.menu_item_id,
      m.restaurant_id,
      m.category_id,
      m.name AS menu_item_name,
      m.description AS menu_item_description,
      m.price,
      m.is_available,
      m.created_at,

      r.name AS restaurant_name,
      r.description AS restaurant_description,
      r.address AS restaurant_address,
      r.city AS restaurant_city,
      r.phone_number AS restaurant_phone,
      r.email AS restaurant_email,
      r.cuisine_type AS restaurant_cuisine_type,

      c.name AS category_name,
      c.description AS category_description,
      c.is_active AS category_is_active

    FROM MenuItems m
    INNER JOIN Restaurants r ON m.restaurant_id = r.restaurant_id
    INNER JOIN Categories c ON m.category_id = c.category_id
    ORDER BY m.menu_item_id DESC
  `;

  const result = await db.request().query(query);

  return result.recordset.map((row: any) => ({
    menu_item_id: row.menu_item_id,
    name: row.menu_item_name,
    description: row.menu_item_description,
    price: row.price,
    is_available: row.is_available,
    created_at: row.created_at,

    restaurant: {
      restaurant_id: row.restaurant_id,
      name: row.restaurant_name,
      description: row.restaurant_description,
      address: row.restaurant_address,
      city: row.restaurant_city,
      phone_number: row.restaurant_phone,
      email: row.restaurant_email,
      cuisine_type: row.restaurant_cuisine_type,
    },

    category: {
      category_id: row.category_id,
      name: row.category_name,
      description: row.category_description,
      is_active: row.category_is_active,
    },
  }));
};

// GET SINGLE MENU ITEM BY ID
export const getMenuItemById = async (menu_item_id: number): Promise<MenuItemResponse | null> => {
  const db = await getDbPool();

  const query = `
    SELECT 
      m.menu_item_id,
      m.restaurant_id,
      m.category_id,
      m.name AS menu_item_name,
      m.description AS menu_item_description,
      m.price,
      m.is_available,
      m.created_at,

      r.name AS restaurant_name,
      r.description AS restaurant_description,
      r.address AS restaurant_address,
      r.city AS restaurant_city,
      r.phone_number AS restaurant_phone,
      r.email AS restaurant_email,
      r.cuisine_type AS restaurant_cuisine_type,

      c.name AS category_name,
      c.description AS category_description,
      c.is_active AS category_is_active

    FROM MenuItems m
    INNER JOIN Restaurants r ON m.restaurant_id = r.restaurant_id
    INNER JOIN Categories c ON m.category_id = c.category_id
    WHERE m.menu_item_id = @menu_item_id
  `;

  const result = await db.request()
    .input("menu_item_id", menu_item_id)
    .query(query);

  if (!result.recordset.length) return null;

  const row = result.recordset[0];

  return {
    menu_item_id: row.menu_item_id,
    name: row.menu_item_name,
    description: row.menu_item_description,
    price: row.price,
    is_available: row.is_available,
    created_at: row.created_at,

    restaurant: {
      restaurant_id: row.restaurant_id,
      name: row.restaurant_name,
      description: row.restaurant_description,
      address: row.restaurant_address,
      city: row.restaurant_city,
      phone_number: row.restaurant_phone,
      email: row.restaurant_email,
      cuisine_type: row.restaurant_cuisine_type,
    },

    category: {
      category_id: row.category_id,
      name: row.category_name,
      description: row.category_description,
      is_active: row.category_is_active,
    },
  };
};

// CREATE MENU ITEM
export const createMenuItem = async (data: {
  restaurant_id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  is_available?: boolean;
}): Promise<string> => {
  const db = await getDbPool();

  const query = `
    INSERT INTO MenuItems (restaurant_id, category_id, name, description, price, is_available)
    VALUES (@restaurant_id, @category_id, @name, @description, @price, @is_available)
  `;

  const result = await db.request()
    .input("restaurant_id", data.restaurant_id)
    .input("category_id", data.category_id)
    .input("name", data.name)
    .input("description", data.description || "")
    .input("price", data.price)
    .input("is_available", data.is_available ?? 1)
    .query(query);

  return result.rowsAffected[0] === 1
    ? "Menu item created successfully ✅"
    : "Failed to create menu item ❌";
};

// UPDATE MENU ITEM
export const updateMenuItem = async (
  menu_item_id: number,
  data: {
    restaurant_id: number;
    category_id: number;
    name: string;
    description?: string;
    price: number;
    is_available?: boolean;
  }
): Promise<MenuItemResponse | null> => {
  const db = await getDbPool();

  const query = `
    UPDATE MenuItems
    SET 
      restaurant_id = @restaurant_id,
      category_id = @category_id,
      name = @name,
      description = @description,
      price = @price,
      is_available = @is_available
    WHERE menu_item_id = @menu_item_id
  `;

  await db.request()
    .input("menu_item_id", menu_item_id)
    .input("restaurant_id", data.restaurant_id)
    .input("category_id", data.category_id)
    .input("name", data.name)
    .input("description", data.description || "")
    .input("price", data.price)
    .input("is_available", data.is_available ?? 1)
    .query(query);

  return await getMenuItemById(menu_item_id);
};

// DELETE MENU ITEM
export const deleteMenuItem = async (menu_item_id: number): Promise<string> => {
  const db = await getDbPool();

  const query = "DELETE FROM MenuItems WHERE menu_item_id = @menu_item_id";

  const result = await db.request()
    .input("menu_item_id", menu_item_id)
    .query(query);

  return result.rowsAffected[0] === 1
    ? "Menu item deleted successfully 🗑️"
    : "Failed to delete menu item ⚠️";
};
