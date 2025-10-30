import { Hono } from "hono";
import * as restaurantControllers from "./restaurant.controllers.ts";
import { adminRoleAuth } from "../middleware/bearAuth.ts";

const restaurantRoutes = new Hono();

// 🟢 Public route
restaurantRoutes.get("/restaurants/:restaurant_id", restaurantControllers.getRestaurantById);

// 🔐 Admin-only routes
restaurantRoutes.get("/restaurants", adminRoleAuth, restaurantControllers.getAllRestaurants);
restaurantRoutes.post("/restaurants", adminRoleAuth, restaurantControllers.createRestaurant);
restaurantRoutes.put("/restaurants/:restaurant_id", adminRoleAuth, restaurantControllers.updateRestaurant);
restaurantRoutes.delete("/restaurants/:restaurant_id", adminRoleAuth, restaurantControllers.deleteRestaurant);

export default restaurantRoutes;
