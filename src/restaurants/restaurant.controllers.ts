import type { Context } from "hono";
import * as restaurantService from "../restaurants/restaurants.service.ts";

// Get all restaurants (Admin only)
export const getAllRestaurants = async (c: Context) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    return c.json(restaurants, 200);
  } catch (error: any) {
    console.error("Error fetching restaurants:", error.message);
    return c.json({ error: "Failed to fetch restaurants" }, 500);
  }
};

// Get restaurant by ID
export const getRestaurantById = async (c: Context) => {
  const restaurantId = Number(c.req.param("restaurant_id"));

  if (isNaN(restaurantId)) {
    return c.json({ error: "Invalid restaurant ID" }, 400);
  }

  try {
    const restaurant = await restaurantService.getRestaurantById(restaurantId);
    if (!restaurant) {
      return c.json({ error: "Restaurant not found" }, 404);
    }
    return c.json(restaurant, 200);
  } catch (error: any) {
    console.error("Error fetching restaurant:", error.message);
    return c.json({ error: "Failed to fetch restaurant" }, 500);
  }
};

// Create restaurant (Admin only)
export const createRestaurant = async (c: Context) => {
  try {
    const data = await c.req.json();
    const result = await restaurantService.createRestaurant(data);
    return c.json({ message: "Restaurant created successfully", restaurant: result }, 201);
  } catch (error: any) {
    console.error("Error creating restaurant:", error.message);
    return c.json({ error: "Failed to create restaurant" }, 500);
  }
};

// Update restaurant (Admin only)
export const updateRestaurant = async (c: Context) => {
  const restaurantId = Number(c.req.param("restaurant_id"));
  if (isNaN(restaurantId)) {
    return c.json({ error: "Invalid restaurant ID" }, 400);
  }

  try {
    const data = await c.req.json();
    const updated = await restaurantService.updateRestaurant(restaurantId, data);
    if (!updated) {
      return c.json({ error: "Restaurant not found" }, 404);
    }
    return c.json({ message: "Restaurant updated successfully" }, 200);
  } catch (error: any) {
    console.error("Error updating restaurant:", error.message);
    return c.json({ error: "Failed to update restaurant" }, 500);
  }
};

// Delete restaurant (Admin only)
export const deleteRestaurant = async (c: Context) => {
  const restaurantId = Number(c.req.param("restaurant_id"));
  if (isNaN(restaurantId)) {
    return c.json({ error: "Invalid restaurant ID" }, 400);
  }

  try {
    const deleted = await restaurantService.deleteRestaurant(restaurantId);
    if (!deleted) {
      return c.json({ error: "Restaurant not found" }, 404);
    }
    return c.json({ message: "Restaurant deleted successfully" }, 200);
  } catch (error: any) {
    console.error("Error deleting restaurant:", error.message);
    return c.json({ error: "Failed to delete restaurant" }, 500);
  }
};
