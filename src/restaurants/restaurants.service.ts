import { getDbPool } from "../db/db.config.ts";

// Fetch all restaurants
export const getAllRestaurants = async () => {
  const pool = await getDbPool();
  const result = await pool.request().query(`
    SELECT * FROM Restaurants 
    ORDER BY restaurant_id DESC
  `);
  return result.recordset;
};

// Fetch single restaurant by ID
export const getRestaurantById = async (restaurantId: number) => {
  const pool = await getDbPool();
  const result = await pool
    .request()
    .input("restaurant_id", restaurantId)
    .query("SELECT * FROM Restaurants WHERE restaurant_id = @restaurant_id");

  return result.recordset[0];
};

// Create new restaurant
export const createRestaurant = async (data: any) => {
  const pool = await getDbPool();
  const {
    name,
    description,
    address,
    city,
    phone_number,
    email,
    opening_time,
    closing_time,
    cuisine_type,
    is_active = 1,
  } = data;

  const result = await pool
    .request()
    .input("name", name)
    .input("description", description)
    .input("address", address)
    .input("city", city)
    .input("phone_number", phone_number)
    .input("email", email)
    .input("opening_time", opening_time)
    .input("closing_time", closing_time)
    .input("cuisine_type", cuisine_type)
    .input("is_active", is_active)
    .query(`
      INSERT INTO Restaurants 
        (name, description, address, city, phone_number, email, opening_time, closing_time, cuisine_type, is_active)
      OUTPUT INSERTED.*
      VALUES 
        (@name, @description, @address, @city, @phone_number, @email, @opening_time, @closing_time, @cuisine_type, @is_active)
    `);

  return result.recordset[0];
};

// Update restaurant
export const updateRestaurant = async (restaurantId: number, data: any) => {
  const pool = await getDbPool();
  const {
    name,
    description,
    address,
    city,
    phone_number,
    email,
    opening_time,
    closing_time,
    cuisine_type,
    is_active,
  } = data;

  const result = await pool
    .request()
    .input("restaurant_id", restaurantId)
    .input("name", name)
    .input("description", description)
    .input("address", address)
    .input("city", city)
    .input("phone_number", phone_number)
    .input("email", email)
    .input("opening_time", opening_time)
    .input("closing_time", closing_time)
    .input("cuisine_type", cuisine_type)
    .input("is_active", is_active)
    .query(`
      UPDATE Restaurants
      SET 
        name = @name,
        description = @description,
        address = @address,
        city = @city,
        phone_number = @phone_number,
        email = @email,
        opening_time = @opening_time,
        closing_time = @closing_time,
        cuisine_type = @cuisine_type,
        is_active = @is_active
      WHERE restaurant_id = @restaurant_id
    `);

  return result.rowsAffected[0] > 0;
};

// Delete restaurant
export const deleteRestaurant = async (restaurantId: number) => {
  const pool = await getDbPool();
  const result = await pool
    .request()
    .input("restaurant_id", restaurantId)
    .query("DELETE FROM Restaurants WHERE restaurant_id = @restaurant_id");

  return result.rowsAffected[0] > 0;
};
