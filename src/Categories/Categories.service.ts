
import { getDbPool } from "src/db/db.config.ts";

// Response Interface t
interface CategoryResponse {
    category_id: number;
    restaurant_id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at?: Date;

    // Restaurant fields
    restaurant_name: string;
    restaurant_description?: string;
    address?: string;
    city?: string;
    phone_number?: string;
    email?: string;
    opening_time?: string;
    closing_time?: string;
    cuisine_type?: string;
    restaurant_is_active: boolean;
}

//  GET ALL CATEGORIES 
export const getAllCategories = async (): Promise<CategoryResponse[]> => {
    const db = getDbPool();
    const query = `
        SELECT 
            c.category_id,
            c.restaurant_id,
            c.name,
            c.description,
            c.is_active,
            c.created_at,

            r.name AS restaurant_name,
            r.description AS restaurant_description,
            r.address,
            r.city,
            r.phone_number,
            r.email,
            r.opening_time,
            r.closing_time,
            r.cuisine_type,
            r.is_active AS restaurant_is_active

        FROM Categories c
        INNER JOIN Restaurants r 
            ON c.restaurant_id = r.restaurant_id
    `;

    const result = await db.request().query(query);
    return result.recordset;
};

//  GET CATEGORY BY ID 
export const getCategoriesById = async (category_id: number): Promise<CategoryResponse | null> => {
    const db = getDbPool();
    const query = `
        SELECT 
            c.category_id,
            c.restaurant_id,
            c.name,
            c.description,
            c.is_active,
            c.created_at,

            r.name AS restaurant_name,
            r.description AS restaurant_description,
            r.address,
            r.city,
            r.phone_number,
            r.email,
            r.opening_time,
            r.closing_time,
            r.cuisine_type,
            r.is_active AS restaurant_is_active

        FROM Categories c
        INNER JOIN Restaurants r 
            ON c.restaurant_id = r.restaurant_id
        WHERE c.category_id = @category_id
    `;

    const result = await db.request()
        .input("category_id", category_id)
        .query(query);

    return result.recordset[0] || null;
};

// CREATE CATEGORY 
export const createCategory = async (
    restaurant_id: number,
    name: string,
    description?: string,
    is_active: boolean = true
): Promise<string> => {
    const db = getDbPool();
    const query = `
        INSERT INTO Categories (restaurant_id, name, description, is_active)
        VALUES (@restaurant_id, @name, @description, @is_active)
    `;

    const result = await db.request()
        .input("restaurant_id", restaurant_id)
        .input("name", name)
        .input("description", description || null)
        .input("is_active", is_active)
        .query(query);

    return result.rowsAffected[0] === 1
        ? "Category created successfully 🎉"
        : "Failed to create category";
};

//  UPDATE CATEGORY
export const updateCategories = async (
    category_id: number,
    restaurant_id: number,
    name: string,
    description?: string,
    is_active: boolean = true
): Promise<CategoryResponse | null> => {
    const db = getDbPool();
    const query = `
        UPDATE Categories
        SET restaurant_id=@restaurant_id,
            name=@name,
            description=@description,
            is_active=@is_active
        WHERE category_id=@category_id
    `;

    await db.request()
        .input("category_id", category_id)
        .input("restaurant_id", restaurant_id)
        .input("name", name)
        .input("description", description || null)
        .input("is_active", is_active)
        .query(query);

    return await getCategoriesById(category_id);
};

//  DELETE CATEGORY
export const deletecategories = async (category_id: number): Promise<string> => {
    const db = getDbPool();
    const query = "DELETE FROM Categories WHERE category_id=@category_id";

    const result = await db.request()
        .input("category_id", category_id)
        .query(query);

    return result.rowsAffected[0] === 1
        ? "Category deleted successfully 🎊"
        : "Failed to delete category";
};
