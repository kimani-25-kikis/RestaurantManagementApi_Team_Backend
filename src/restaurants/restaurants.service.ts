import { getDbPool } from '../db/db.config.ts';
import sql from 'mssql';

/* ---------- READ ---------- */
export const getAllRestaurants = async () => {
  const pool = await getDbPool();
  const result = await pool.request().query(`
    SELECT restaurant_id, name, description, address, city,
           phone_number, email, opening_time, closing_time,
           cuisine_type, is_active
    FROM Restaurants
  `);
  return result.recordset;
};

export const getRestaurantById = async (restaurant_id: number) => {
  const pool = await getDbPool();
  const result = await pool
    .request()
    .input('restaurant_id', sql.Int, restaurant_id)
    .query(`
      SELECT restaurant_id, name, description, address, city,
             phone_number, email, opening_time, closing_time,
             cuisine_type, is_active
      FROM Restaurants
      WHERE restaurant_id = @restaurant_id
    `);

  return result.recordset[0] ?? null;
};

/* ---------- CREATE ---------- */
export const createRestaurant = async (data: any) => {
  const pool = await getDbPool();
  const {
    name, description, address, city,
    phone_number, email, opening_time,
    closing_time, cuisine_type,
  } = data;

  await pool
    .request()
    .input('name', sql.NVarChar, name)
    .input('description', sql.NVarChar, description)
    .input('address', sql.NVarChar, address)
    .input('city', sql.NVarChar, city)
    .input('phone_number', sql.NVarChar, phone_number)
    .input('email', sql.NVarChar, email)
    .input('opening_time', sql.Time, opening_time)
    .input('closing_time', sql.Time, closing_time)
    .input('cuisine_type', sql.NVarChar, cuisine_type)
    .query(`
      INSERT INTO Restaurants
        (name, description, address, city, phone_number,
         email, opening_time, closing_time, cuisine_type)
      VALUES
        (@name, @description, @address, @city, @phone_number,
         @email, @opening_time, @closing_time, @cuisine_type)
    `);
};

/* ---------- UPDATE ---------- */
export const updateRestaurant = async (restaurant_id: number, data: any) => {
  const pool = await getDbPool();
  const {
    name, description, address, city,
    phone_number, email, opening_time,
    closing_time, cuisine_type, is_active,
  } = data;

  await pool
    .request()
    .input('restaurant_id', sql.Int, restaurant_id)
    .input('name', sql.NVarChar, name)
    .input('description', sql.NVarChar, description)
    .input('address', sql.NVarChar, address)
    .input('city', sql.NVarChar, city)
    .input('phone_number', sql.NVarChar, phone_number)
    .input('email', sql.NVarChar, email)
    .input('opening_time', sql.Time, opening_time)
    .input('closing_time', sql.Time, closing_time)
    .input('cuisine_type', sql.NVarChar, cuisine_type)
    .input('is_active', sql.Bit, is_active)
    .query(`
      UPDATE Restaurants SET
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
};

/* ---------- DELETE ---------- */
export const deleteRestaurant = async (restaurant_id: number) => {
  const pool = await getDbPool();
  await pool
    .request()
    .input('restaurant_id', sql.Int, restaurant_id)
    .query('DELETE FROM Restaurants WHERE restaurant_id = @restaurant_id');
};