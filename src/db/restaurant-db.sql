CREATE DATABASE RestaurantManagementDB;

-- USERS TABLE
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    phone_number NVARCHAR(15),
    password NVARCHAR(255) NOT NULL,
    user_type NVARCHAR DEFAULT(20) NOT NULL,
    user_type NVARCHAR(20) NOT NULL DEFAULT 'customer',
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2
);


-- RESTAURANTS TABLE
CREATE TABLE Restaurants (
    restaurant_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    address NVARCHAR(200),
    city NVARCHAR(50),
    phone_number NVARCHAR(15),
    email NVARCHAR(100),
    opening_time TIME,
    closing_time TIME,
    cuisine_type NVARCHAR(50),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);

-- CATEGORIES TABLE
CREATE TABLE Categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name NVARCHAR(50) NOT NULL,
    description NVARCHAR(255),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_Categories_Restaurants 
        FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id)
);

-- MENUITEMS TABLE
CREATE TABLE MenuItems (
    menu_item_id INT IDENTITY(1,1) PRIMARY KEY,
    restaurant_id INT NOT NULL,
    category_id INT NOT NULL,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    is_available BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_MenuItems_Restaurants 
        FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id),

    CONSTRAINT FK_MenuItems_Categories 
        FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- ORDERS TABLE
CREATE TABLE Orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    restaurant_id INT NOT NULL,
    customer_id INT NOT NULL,
    order_type NVARCHAR(20) NOT NULL,
    status NVARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_Orders_Restaurants 
        FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id),

    CONSTRAINT FK_Orders_Users 
        FOREIGN KEY (customer_id) REFERENCES Users(user_id)
);

-- ORDERITEMS TABLE
CREATE TABLE OrderItems (
    order_item_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT FK_OrderItems_Orders 
        FOREIGN KEY (order_id) REFERENCES Orders(order_id),

    CONSTRAINT FK_OrderItems_MenuItems 
        FOREIGN KEY (menu_item_id) REFERENCES MenuItems(menu_item_id)
);

--Values for users table
INSERT INTO Users (first_name, last_name, email, phone_number, password, user_type, created_at)
VALUES
('Joshua', 'Kimani', 'joshua@gmail.com', '0797390822', 'hashedpwd1', 'customer', GETDATE()),
('Emma', 'Njeri', 'emma@gmail.com', '071112222', 'hashedpwd2', 'customer', GETDATE()),
('David', 'Otieno', 'david@gmail.com', '0733344422', 'hashedpwd3', 'admin', GETDATE());

--values for Restaurants table

INSERT INTO Restaurants (name, description, address, city, phone_number, email, opening_time, closing_time, cuisine_type, is_active, created_at)
VALUES
('Pizza Palace', 'Best pizzas in town', '123 Street A', 'Nairobi', '0789333333', 'contact@pizzapalace.com', '10:00', '22:00', 'Italian', 1, GETDATE()),
('Sushi World', 'Authentic Japanese Sushi', '456 Avenue B', 'Kiambu', '07653547733', 'info@sushiworld.com', '11:00', '23:00', 'Japanese', 1, GETDATE());

--Values for Categories table

INSERT INTO Categories (restaurant_id, name, description, is_active, created_at)
VALUES
(1, 'Pizza', 'Cheesy and delicious pizzas', 1, GETDATE()),
(1, 'Drinks', 'Soft drinks and beverages', 1, GETDATE()),
(2, 'Sushi', 'Fresh sushi rolls', 1, GETDATE());

--values for Menu items table 

INSERT INTO MenuItems (restaurant_id, category_id, name, description, price, is_available, created_at)
VALUES
(1, 1, 'Margherita', 'Classic cheese pizza', 8.99, 1, GETDATE()),
(1, 1, 'Pepperoni', 'Spicy pepperoni pizza', 10.99, 1, GETDATE()),
(1, 2, 'Coke', 'Can of Coke', 1.99, 1, GETDATE()),
(2, 3, 'California Roll', 'Crab and avocado', 6.49, 1, GETDATE());

--Values for orders table

INSERT INTO Orders (restaurant_id, customer_id, order_type, status, total_amount, created_at)
VALUES
(1, 1, 'delivery', 'completed', 20.97, GETDATE()),
(2, 2, 'pickup', 'pending', 6.49, GETDATE());

--Values for orderItem table 

INSERT INTO OrderItems (order_id, menu_item_id, quantity, unit_price, total_price, created_at)
VALUES
(1, 1, 1, 8.99, 8.99, GETDATE()),
(1, 2, 1, 10.99, 10.99, GETDATE()),
(1, 3, 1, 1.99, 1.99, GETDATE()),
(2, 4, 1, 6.49, 6.49, GETDATE());
