CREATE DATABASE shit_manager;

CREATE TABLE users(
    id UUID NOT NULL PRIMARY KEY,
    username VARCHAR(15) NOT NULL,
    password VARCHAR(20) NOT NULL
);