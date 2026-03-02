-- Script opcional de criação do banco e tabela
-- Aconselhamos rodar este script no phpMyAdmin, MySQL Workbench ou similar

-- 1. Cria o banco caso não exista
CREATE DATABASE IF NOT EXISTS web_03ma;

-- 2. Seleciona o banco recém criado
USE web_03ma;

-- 3. Cria a tabela pedida na tarefa
CREATE TABLE IF NOT EXISTS lucas_produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100)
);

-- Opcionalmente: insere alguns dados testes manuais
INSERT INTO
    lucas_produtos (nome, descricao, categoria)
VALUES (
        'Smartphone XYZ',
        'Smartphone moderno com 128GB',
        'Mobile'
    ),
    (
        'Monitor UltraWide',
        'Monitor de 29 polegadas ultrawide da LG',
        'Informática'
    );