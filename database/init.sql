CREATE DATABASE IF NOT EXISTS carrosdb;

USE carrosdb;

-- ======================
-- TABELA CARROS
-- ======================
CREATE TABLE IF NOT EXISTS carros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    ano INT,
    preco DECIMAL(10,2),
    imagem VARCHAR(255)
);

-- ======================
-- TABELA USERS
-- ======================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);