CREATE DATABASE shop_me_online;

CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4(),
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    password VARCHAR(25) NOT NULL,
    address VARCHAR(100),
    email VARCHAR(50) NOT NULL,
    credit_card_number VARCHAR(16),
    is_manager BOOLEAN NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT email_unq UNIQUE(email)
);

CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4(),
    name VARCHAR(20) NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    category VARCHAR(20) NOT NULL,
    img_location VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE users_products (
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    address VARCHAR(100) NOT NULL,
    paid BOOLEAN NOT NUll,
    amount INTEGER NOT NULL,
    size VARCHAR(2) NOT NULL,
    ordering_time TIMESTAMP NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE wishlist (
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_product FOREIGN KEY(product_id) REFERENCES products(id)
);