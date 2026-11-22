
var database = require("../database/config");

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

    return database.executar(instrucaoSql, [email]);
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

    return database.executar(instrucaoSql, [
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

    return database.executar(instrucaoSql, valores);
}


// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    autenticar,
    verificarTerritorioReino,
    cadastrar
};
