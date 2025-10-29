import type { Context } from 'hono';
import {
  getAllRestaurants as getAllRestaurantsService,
  getRestaurantById as getRestaurantByIdService,
  createRestaurant as createRestaurantService,
  updateRestaurant as updateRestaurantService,
  deleteRestaurant as deleteRestaurantService,
} from '../restaurants/restaurants.service.ts';

export const getAllRestaurants = async (c: Context): Promise<Response> => {
  const restaurants = await getAllRestaurantsService();
  return c.json(restaurants, 200);
};

export const getRestaurantById = async (c: Context): Promise<Response> => {
  try {
    const id = Number(c.req.param('id'));

    if (isNaN(id)) {
      return c.json({ error: 'Invalid restaurant ID' }, 400);
    }

    const restaurant = await getRestaurantByIdService(id);
    if (!restaurant) {
      return c.json({ error: 'Restaurant not found' }, 404);
    }

    return c.json(restaurant, 200);
  } catch (err) {
    console.error('getRestaurantById error:', err);
    return c.json({ error: 'Failed to fetch restaurant' }, 500);
  }
};
const normalizeTime = (time: string): string => {
  if (!time) return time;
  // Add :00 if missing
  if (time.match(/^\d{1,2}:\d{2}$/)) {
    return `${time.padStart(5, '0')}:00`; // "9:30" → "09:30:00"
  }
  if (time.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
    return time.padStart(8, '0'); // "9:30:00" → "09:30:00"
  }
  return time;
};

export const createRestaurant = async (c: Context): Promise<Response> => {
  const body = await c.req.json();
  await createRestaurantService(body);
  return c.json({ message: 'Restaurant created successfully' }, 201);
};

export const updateRestaurant = async (c: Context): Promise<Response> => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();
  await updateRestaurantService(id, body);
  return c.json({ message: 'Restaurant updated successfully' }, 200);
};

export const deleteRestaurant = async (c: Context): Promise<Response> => {
  const id = Number(c.req.param('id'));
  await deleteRestaurantService(id);
  return c.json({ message: 'Restaurant deleted successfully' }, 200);
};