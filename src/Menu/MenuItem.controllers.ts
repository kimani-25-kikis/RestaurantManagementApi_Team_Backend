import type { Context } from "hono";
import * as MenuService from "../Menu/MenuItem.services.ts";

// ✅ Get all MenuItems
export const getAllMenuItems = async (c: Context) => {
  try {
    const items = await MenuService.getAllMenuItems();
    return c.json(items, 200);
  } catch (error: any) {
    console.error("Error fetching menu items:", error.message);
    return c.json({ error: "Failed to fetch menu items" }, 500);
  }
};

// ✅ Get MenuItem by ID
export const getMenuItemById = async (c: Context) => {
  const menuItemId = Number(c.req.param("menu_item_id"));
  if (isNaN(menuItemId)) {
    return c.json({ error: "Invalid menu item ID" }, 400);
  }

  try {
    const item = await MenuService.getMenuItemById(menuItemId);
    if (!item) {
      return c.json({ error: "Menu item not found" }, 404);
    }
    return c.json(item, 200);
  } catch (error: any) {
    console.error("Error fetching menu item:", error.message);
    return c.json({ error: "Failed to fetch menu item" }, 500);
  }
};

// ✅ Create MenuItem
export const createMenuItem = async (c: Context) => {
  try {
    const data = await c.req.json();
    const result = await MenuService.createMenuItem(data);
    return c.json({ message: "Menu item created successfully", menu_item: result }, 201);
  } catch (error: any) {
    console.error("Error creating menu item:", error.message);
    return c.json({ error: "Failed to create menu item" }, 500);
  }
};

// ✅ Update MenuItem
export const updateMenuItem = async (c: Context) => {
  const menuItemId = Number(c.req.param("menu_item_id"));
  if (isNaN(menuItemId)) {
    return c.json({ error: "Invalid menu item ID" }, 400);
  }

  try {
    const data = await c.req.json();
    const updated = await MenuService.updateMenuItem(menuItemId, data);
    if (!updated) {
      return c.json({ error: "Menu item not found" }, 404);
    }
    return c.json({ message: "Menu item updated successfully" }, 200);
  } catch (error: any) {
    console.error("Error updating menu item:", error.message);
    return c.json({ error: "Failed to update menu item" }, 500);
  }
};

// ✅ Delete MenuItem
export const deleteMenuItem = async (c: Context) => {
  const menuItemId = Number(c.req.param("menu_item_id"));
  if (isNaN(menuItemId)) {
    return c.json({ error: "Invalid menu item ID" }, 400);
  }

  try {
    const deleted = await MenuService.deleteMenuItem(menuItemId);
    if (!deleted) {
      return c.json({ error: "Menu item not found" }, 404);
    }
    return c.json({ message: "Menu item deleted successfully" }, 200);
  } catch (error: any) {
    console.error("Error deleting menu item:", error.message);
    return c.json({ error: "Failed to delete menu item" }, 500);
  }
};