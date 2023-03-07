CREATE DATABASE shop_me_online;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO products(name,quantity,price,category,img_location) VALUES('Air Jordan 1 Lucky Green', 100, 150, '#shoes#green', '');

CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4(),
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    password VARCHAR(25) NOT NULL,
    address VARCHAR(100),
    email VARCHAR(50) NOT NULL,
    credit_card_number VARCHAR(16),
    is_manager BOOLEAN NOT NULL,
    token VARCHAR,
    PRIMARY KEY (id),
    CONSTRAINT chk_credit CHECK (char_length(credit_card_number) = 16),
    CONSTRAINT chk_password CHECK (char_length(password) >= 8),
    CONSTRAINT email_unq UNIQUE(email)
);

CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4(),
    name VARCHAR(60) NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    category VARCHAR(100) NOT NULL,
    img_location VARCHAR(100) NOT NULL,
    img_uploaded Boolean DEFAULT false,
    CONSTRAINT chk_quantity CHECK (quantity >= 0),
    CONSTRAINT chk_price CHECK (price > 0),
    PRIMARY KEY (id)
);

CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4(),
    address VARCHAR(100) NOT NULL,
    paid BOOLEAN NOT NUll, 
    ordering_time TIMESTAMP NOT NULL,
    user_id UUID NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
    PRIMARY KEY (id)
);

CREATE TABLE cart (
    item_id UUID,
    transaction_id UUID NOT NULL,
    product_id UUID NOT NULL,
    amount INTEGER NOT NULL,
    size VARCHAR(2) NOT NULL,
    CONSTRAINT chk_amount CHECK (amount > 0),
    CONSTRAINT fk_transaction FOREIGN KEY(transaction_id) REFERENCES transactions(id),
    CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES products(id),
    PRIMARY KEY (item_id)
);

CREATE TABLE wishlist (
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES products(id)
);