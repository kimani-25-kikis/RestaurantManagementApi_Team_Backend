import {Hono} from 'hono'
import {getAllMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem} from './MenuItem.controllers.ts'
import { adminRoleAuth } from '../middleware/bearAuth.ts'


const menuItemRoutes = new Hono();

menuItemRoutes.get("/MenuItem", getAllMenuItems);
menuItemRoutes.get("/MenuItem/:menu_item_id", getMenuItemById);
menuItemRoutes.post("/MenuItem", createMenuItem);
menuItemRoutes.put("/MenuItem/:menu_item_id", updateMenuItem);
menuItemRoutes.delete("/MenuItem/:menu_item_id", deleteMenuItem);

export default menuItemRoutes;

