import { Hono } from 'hono';
import * as categoryControllers from './Categories.controller.ts';


const CategoryRoutes = new Hono();

// ✅ CREATE CATEGORY
CategoryRoutes.post('/categories', categoryControllers.createCategory);

// ✅ GET ALL CATEGORIES
CategoryRoutes.get('/categories',categoryControllers.getAllCategories);

// ✅ GET CATEGORY BY ID
CategoryRoutes.get('/categories/:category_id', categoryControllers.getCategoriesById);

// ✅ UPDATE CATEGORY
CategoryRoutes.put('/categories/:category_id', categoryControllers.updateCategories);

// ✅ DELETE CATEGORY
CategoryRoutes.delete('/categories/:category_id', categoryControllers.deletecategory);

export default CategoryRoutes;
