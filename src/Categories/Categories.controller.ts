import { type Context } from "hono";
import * as CategoryServices from "./Categories.service.ts";

// ✅ GET ALL CATEGORIES
export const getAllCategories = async (c: Context) => {
    try {
        const result = await CategoryServices.getAllCategories();
        if (result.length === 0) {
            return c.json({ message: 'No category found' }, 404);
        }
        return c.json(result);
    } catch (error: any) {
        console.log('Error fetching categories:', error.message);
        return c.json({ error: 'Failed to fetch categories' }, 500);
    }
};

// ✅ GET CATEGORY BY ID
export const getCategoriesById = async (c: Context) => {
    const category_id = parseInt(c.req.param('category_id'));
    try {
        const result = await CategoryServices.getCategoriesById(category_id);
        if (!result) {
            return c.json({ error: 'Category not found' }, 404);
        }
        return c.json(result);
    } catch (error) {
        console.log('Error fetching category:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
};

// ✅ CREATE CATEGORY
export const createCategory = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { restaurant_id, name, description, is_active } = body;

        if (!restaurant_id || !name) {
            return c.json({ error: 'restaurant_id and name are required' }, 400);
        }

        const message = await CategoryServices.createCategory(
            restaurant_id,
            name,
            description,
            is_active
        );

        return c.json({ message }, 201);
    } catch (error) {
        console.log('Error creating category:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
};

// ✅ UPDATE CATEGORY
export const updateCategories = async (c: Context) => {
    try {
        const category_id = parseInt(c.req.param('category_id'));
        const body = await c.req.json();

        const checkExists = await CategoryServices.getCategoriesById(category_id);
        if (!checkExists) {
            return c.json({ error: 'Category not found' }, 404);
        }

        const result = await CategoryServices.updateCategories(
            category_id,
            body.restaurant_id,
            body.name,
            body.description,
            body.is_active
        );

        return c.json({ message: 'Category updated successfully', updated_category: result }, 200);
    } catch (error) {
        console.log('Error updating category:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
};

// ✅ DELETE CATEGORY
export const deletecategory = async (c: Context) => {
    const category_id = parseInt(c.req.param('category_id'));
    try {
        const check = await CategoryServices.getCategoriesById(category_id);
        if (!check) {
            return c.json({ error: 'Category not found' }, 404);
        }

        const result = await CategoryServices.deletecategories(category_id);

        return c.json({ message: 'Category deleted successfully', deleted_category: result }, 200);
    } catch (error) {
        console.log('Error deleting category:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
};
