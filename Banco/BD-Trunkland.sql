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
);
