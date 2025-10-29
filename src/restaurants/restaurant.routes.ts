import { Hono } from 'hono';
import * as ctrl from '../restaurants/restaurant.controllers.ts';
import { adminRoleAuth } from '../middleware/bearAuth.ts';

const restaurantRoutes = new Hono();

/* ----- PUBLIC READ ----- */
restaurantRoutes.get('/restaurants', ctrl.getAllRestaurants);
restaurantRoutes.get('/restaurants/:id', ctrl.getRestaurantById);

/* ----- ADMIN ONLY ----- */
restaurantRoutes.post('/restaurants', adminRoleAuth, ctrl.createRestaurant);
restaurantRoutes.put('/restaurants/:id', adminRoleAuth, ctrl.updateRestaurant);
restaurantRoutes.delete('/restaurants/:id', adminRoleAuth, ctrl.deleteRestaurant);

export default restaurantRoutes;