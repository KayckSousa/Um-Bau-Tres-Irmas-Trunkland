-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

CREATE DATABASE Trunkland;

USE Trunkland;

CREATE TABLE reino (
    id_reino INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(30) NOT NULL
);

CREATE TABLE territorio (
    id_territorio INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

CREATE TABLE cla (
    id_cla INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    nacionalidade VARCHAR(80),
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,

    id_reino INT NOT NULL,
    id_territorio INT NOT NULL,
    id_cla INT NOT NULL,

    FOREIGN KEY (id_reino)
        REFERENCES reino(id_reino),

    FOREIGN KEY (id_territorio)
        REFERENCES territorio(id_territorio),

    FOREIGN KEY (id_cla)
        REFERENCES cla(id_cla)
);CREATE DATABASE Trunkland;

USE Trunkland;

CREATE TABLE reino (
    id_reino INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(30) NOT NULL
);

CREATE TABLE territorio (
    id_territorio INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    id_reino INT NOT NULL,
    FOREIGN KEY (id_reino)
        REFERENCES reino(id_reino)
);

CREATE TABLE cla (
    id_cla INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    nacionalidade VARCHAR(80),
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,

    id_reino INT NOT NULL,
    id_territorio INT NOT NULL,
    id_cla INT NOT NULL,

    FOREIGN KEY (id_reino)
        REFERENCES reino(id_reino),

    FOREIGN KEY (id_territorio)
        REFERENCES territorio(id_territorio),

    FOREIGN KEY (id_cla)
        REFERENCES cla(id_cla)
);

USE Trunkland;

INSERT INTO reino (nome, descricao, tipo) VALUES
('Reino das Flores', 'Reino das Flores (RF)', 'Reino'),
('Reino Gelado', 'Reino Gelado (RG)', 'Reino'),
('Reino da Diversão', 'Reino da Diversão (RD)', 'Reino'),
('Reino Esquecido', 'Reino Esquecido (RE)', 'Reino'),
('República Quebrada', 'República Quebrada (RQ)', 'República'),
('Reino do Sol', 'Reino do Sol (RS)', 'Reino');

INSERT INTO cla (nome) VALUES
('Ortgorods'),
('Primoders'),
('Copquerkirs'),
('Provelenians'),
('Angardons'),
('Batars'),
('Pentzeradins'),
('Lutivins'),
('Preskalians'),
('Metdalons'),
('Catepoleris'),
('Isthelins');

SELECT * FROM reino;

DESCRIBE territorio;