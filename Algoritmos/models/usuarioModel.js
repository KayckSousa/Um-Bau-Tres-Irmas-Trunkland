
var database = require("../database/config");
var fs = require('fs');
var path = require('path');

// Path para o arquivo de mock local usado em desenvolvimento quando o MySQL
// não estiver configurado. Permite testar cadastro/login sem banco.
var MOCK_USERS_PATH = path.join(__dirname, '..', 'database', 'mock-users.json');

function usingFileMock() {
    // Usa mock quando não há configuração de banco (usuário ou database vazios)
    return (!process.env.DB_USER || !process.env.DB_DATABASE) && process.env.AMBIENTE_PROCESSO === 'desenvolvimento';
}

async function readMockUsers() {
    try {
        const txt = await fs.promises.readFile(MOCK_USERS_PATH, 'utf8');
        return JSON.parse(txt || '[]');
    } catch (err) {
        if (err.code === 'ENOENT') {
            await fs.promises.mkdir(path.dirname(MOCK_USERS_PATH), { recursive: true });
            await fs.promises.writeFile(MOCK_USERS_PATH, '[]', 'utf8');
            return [];
        }
        throw err;
    }
}

async function writeMockUsers(users) {
    await fs.promises.writeFile(MOCK_USERS_PATH, JSON.stringify(users, null, 2), 'utf8');
}

// ======================================================
// CÓDIGO ORIGINAL DO WEB DATA VIZ
// Mantido integralmente, mas desativado para o Trunkland.
// ======================================================

/*

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha);

    var instrucaoSql = `
        SELECT id, nome, email, fk_empresa as empresaId
        FROM usuario
        WHERE email = '${email}' AND senha = '${senha}';
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function cadastrar(nome, email, senha, fkEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha, fkEmpresa);

    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, fk_empresa)
        VALUES ('${nome}', '${email}', '${senha}', '${fkEmpresa}');
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

*/


// ======================================================
// CÓDIGO ADAPTADO PARA O TRUNKLAND
// ======================================================


// AUTENTICAR USUÁRIO PELO E-MAIL

function autenticar(email) {

    console.log("ACESSEI O USUARIO MODEL DO TRUNKLAND");
    console.log("E-mail recebido:", email);

    var instrucaoSql = `
        SELECT
            id_usuario,
            nome,
            nacionalidade,
            email,
            senha,
            id_reino,
            id_territorio,
            id_cla
        FROM usuario
        WHERE email = ?;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    if (usingFileMock()) {
        // modo mock: busca usuário no arquivo JSON
        return readMockUsers().then(users => {
            const found = users.filter(u => u.email === email);
            // mantém a mesma forma de retorno do DB (array)
            return found.map(u => ({
                id_usuario: u.id_usuario,
                nome: u.nome,
                nacionalidade: u.nacionalidade,
                email: u.email,
                senha: u.senha,
                id_reino: u.id_reino,
                id_territorio: u.id_territorio,
                id_cla: u.id_cla
            }));
        });
    }

    return dbExecWithTimeout(instrucaoSql, [email]);
}


// VERIFICAR SE O TERRITÓRIO PERTENCE AO REINO

function verificarTerritorioReino(idTerritorio, idReino) {

    console.log("VERIFICANDO A RELAÇÃO ENTRE REINO E TERRITÓRIO");

    var instrucaoSql = `
        SELECT id_territorio
        FROM territorio
        WHERE id_territorio = ?
        AND id_reino = ?;
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    if (usingFileMock()) {
        // no mock, assumimos que territórios existem e pertencem ao reino
        // se ambos forem inteiros positivos, retornamos um resultado
        if (Number.isInteger(idTerritorio) && Number.isInteger(idReino) && idTerritorio > 0 && idReino > 0) {
            return Promise.resolve([{ id_territorio: idTerritorio }]);
        }
        return Promise.resolve([]);
    }

    return dbExecWithTimeout(instrucaoSql, [
        idTerritorio,
        idReino
    ]);
}


// CADASTRAR UM NOVO USUÁRIO

function cadastrar(nome, nacionalidade, email, senha, idReino, idTerritorio, idCla) {

    console.log("ACESSEI O USUARIO MODEL DO TRUNKLAND");
    console.log("Dados recebidos para cadastro:", nome, nacionalidade, email);

    var instrucaoSql = `
        INSERT INTO usuario
            (nome, nacionalidade, email, senha, id_reino, id_territorio, id_cla)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    var valores = [
        nome,
        nacionalidade,
        email,
        senha,
        idReino,
        idTerritorio,
        idCla
    ];

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    if (usingFileMock()) {
        // modo mock: grava no arquivo JSON
        return readMockUsers().then(users => {
            // verifica duplicidade de e-mail
            if (users.some(u => u.email === email)) {
                var err = new Error('E-mail duplicado');
                err.code = 'ER_DUP_ENTRY';
                throw err;
            }

            // gera id incremental
            var nextId = (users.reduce((acc, u) => Math.max(acc, u.id_usuario || 0), 0) || 0) + 1;

            var novo = {
                id_usuario: nextId,
                nome: nome,
                nacionalidade: nacionalidade,
                email: email,
                senha: senha,
                id_reino: idReino,
                id_territorio: idTerritorio,
                id_cla: idCla
            };

            users.push(novo);
            return writeMockUsers(users).then(() => {
                return { insertId: nextId };
            });
        });
    }

    return dbExecWithTimeout(instrucaoSql, valores);
}

// ======================================================
// ESTATÍSTICAS DA DASHBOARD
// ======================================================


// CONTAR O TOTAL DE USUÁRIOS

function contarUsuarios() {

    var instrucaoSql = `
        SELECT COUNT(*) AS total
        FROM usuario;
    `;

    console.log("Contando usuários cadastrados...");

    if (usingFileMock()) {
        return readMockUsers().then(users => [{ total: users.length }]);
    }

    return dbExecWithTimeout(instrucaoSql);
}


// USUÁRIOS POR REINO

function usuariosPorReino() {

    var instrucaoSql = `
        SELECT
            r.nome,
            COUNT(u.id_usuario) AS quantidade
        FROM reino r
        LEFT JOIN usuario u
            ON r.id_reino = u.id_reino
        GROUP BY r.id_reino, r.nome
        ORDER BY quantidade DESC;
    `;

    console.log("Buscando usuários por reino...");

    if (usingFileMock()) {
        // agrupa por id_reino e retorna nomes genéricos
        return readMockUsers().then(users => {
            const map = {};
            users.forEach(u => {
                const key = u.id_reino || 0;
                map[key] = (map[key] || 0) + 1;
            });
            // transforma em array semelhante ao retorno do DB
            return Object.keys(map).map(k => ({ nome: `Reino ${k}`, quantidade: map[k] }));
        });
    }

    return dbExecWithTimeout(instrucaoSql);
}


// USUÁRIOS POR TERRITÓRIO

function usuariosPorTerritorio() {

    var instrucaoSql = `
        SELECT
            t.nome,
            COUNT(u.id_usuario) AS quantidade
        FROM territorio t
        LEFT JOIN usuario u
            ON t.id_territorio = u.id_territorio
        GROUP BY t.id_territorio, t.nome
        ORDER BY quantidade DESC;
    `;

    console.log("Buscando usuários por território...");

    if (usingFileMock()) {
        return readMockUsers().then(users => {
            const map = {};
            users.forEach(u => {
                const key = u.id_territorio || 0;
                map[key] = (map[key] || 0) + 1;
            });
            return Object.keys(map).map(k => ({ nome: `Território ${k}`, quantidade: map[k] }));
        });
    }

    return dbExecWithTimeout(instrucaoSql);
}


// USUÁRIOS POR CLÃ

function usuariosPorCla() {

    var instrucaoSql = `
        SELECT
            c.nome,
            COUNT(u.id_usuario) AS quantidade
        FROM cla c
        LEFT JOIN usuario u
            ON c.id_cla = u.id_cla
        GROUP BY c.id_cla, c.nome
        ORDER BY quantidade DESC;
    `;

    console.log("Buscando usuários por clã...");

    if (usingFileMock()) {
        return readMockUsers().then(users => {
            const map = {};
            users.forEach(u => {
                const key = u.id_cla || 0;
                map[key] = (map[key] || 0) + 1;
            });
            return Object.keys(map).map(k => ({ nome: `Clã ${k}`, quantidade: map[k] }));
        });
    }

    return dbExecWithTimeout(instrucaoSql);
}


// Helper: executa a query com timeout para evitar requests travados
function dbExecWithTimeout(instrucao, parametros) {
    var timeoutMs = 5000;
    var timeoutPromise = new Promise(function (_, reject) {
        setTimeout(function () {
            var err = new Error('Tempo de conexão com o banco esgotado');
            err.isDbConnectionError = true;
            reject(err);
        }, timeoutMs);
    });

    var execPromise = database.executar(instrucao, parametros);

    return Promise.race([execPromise, timeoutPromise]);
}



// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    autenticar,
    verificarTerritorioReino,
    cadastrar,

    // Funções da Dashboard
    contarUsuarios,
    usuariosPorReino,
    usuariosPorTerritorio,
    usuariosPorCla
};
