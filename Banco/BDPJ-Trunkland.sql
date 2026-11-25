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

SELECT * FROM cla;

SELECT id_reino, nome FROM reino;

INSERT INTO territorio (nome, descricao, id_reino) VALUES
-- Reino das Flores
('Reino Ruzislav', 'Território do Reino das Flores', 1),
('Terra Antiga', 'Território do Reino das Flores', 1),
('Terras Scands', 'Território do Reino das Flores', 1),
('Terra dos Lagos', 'Território do Reino das Flores', 1),
('Vice Reino Rumé', 'Território do Reino das Flores', 1),
('Terras Colquidas', 'Território do Reino das Flores', 1),
('Território de Bulues', 'Território do Reino das Flores', 1),
('Reino Magermon', 'Território do Reino das Flores', 1),
('Reino Franbator', 'Território do Reino das Flores', 1),
('Reino Ibeker', 'Território do Reino das Flores', 1),
('Reino Itrapafor', 'Território do Reino das Flores', 1),
('Reino Capital', 'Território do Reino das Flores', 1),

-- Reino Gelado
('Ducado de Purtolian', 'Território do Reino Gelado', 2),
('Reino de Ottivenia', 'Território do Reino Gelado', 2),
('Ducado do Sul', 'Território do Reino Gelado', 2),
('Reino do Oceano', 'Território do Reino Gelado', 2),
('Reino Mexquerzim', 'Território do Reino Gelado', 2),

-- Reino da Diversão
('Reino Pratiado', 'Território do Reino da Diversão', 3),
('Grão Grandemor', 'Território do Reino da Diversão', 3),
('Ducado da Conpelivia', 'Território do Reino da Diversão', 3),
('Reino Chisgard', 'Território do Reino da Diversão', 3),

-- Reino Esquecido
('Reino de Afregarbat', 'Território do Reino Esquecido', 4),

-- República Quebrada
('Floresta Obscure Kriedtch', 'Território da República Quebrada', 5),
('Reino da Psisvânia', 'Território da República Quebrada', 5),
('República Numitania', 'Território da República Quebrada', 5),
('República Soloriental', 'Território da República Quebrada', 5),
('Reino Nejtodord', 'Território da República Quebrada', 5),
('República Qagard', 'Território da República Quebrada', 5),
('República Esteptans', 'Território da República Quebrada', 5),
('República da Javasia', 'Território da República Quebrada', 5),

-- Reino do Sol
('Reino Josol', 'Território do Reino do Sol', 6),
('Reino Japtain', 'Território do Reino do Sol', 6),
('Reino Indrialom', 'Território do Reino do Sol', 6),
('Reino Mandoghuan', 'Território do Reino do Sol', 6),
('Reino Filbior', 'Território do Reino do Sol', 6);

SELECT
    territorio.id_territorio,
    territorio.nome AS territorio,
    reino.nome AS reino
FROM territorio
INNER JOIN reino
ON territorio.id_reino = reino.id_reino
ORDER BY reino.id_reino;

DESCRIBE usuario;

SHOW CREATE TABLE usuario;

USE Trunkland;

SELECT id_reino, nome
FROM reino
ORDER BY id_reino;

SELECT id_territorio, nome, id_reino
FROM territorio
ORDER BY id_territorio;

SELECT id_cla, nome
FROM cla
ORDER BY id_cla;

USE Trunkland;

SELECT * FROM usuario;