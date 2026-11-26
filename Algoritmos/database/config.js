
var mysql = require("mysql2");

// ======================================================
// CONEXÃO DO BANCO MYSQL SERVER
// ======================================================

var mySqlConfig = {
    host: process.env.DB_HOST || "127.0.0.1",
    database: process.env.DB_DATABASE || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    // garante que a porta seja um número (mysql2 aceita string, mas é mais claro)
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306
};

// Tempo máximo (ms) para tentar conectar ao MySQL antes de falhar.
// Reduz o tempo de espera quando o banco não está disponível localmente.
mySqlConfig.connectTimeout = process.env.DB_CONNECT_TIMEOUT ? parseInt(process.env.DB_CONNECT_TIMEOUT, 10) : 5000;
mySqlConfig.multipleStatements = false;

// Quando o host estiver como 'localhost', o driver às vezes tenta
// usar socket Unix e pode bloquear; forçamos 127.0.0.1 para TCP.
if (String(mySqlConfig.host).trim().toLowerCase() === 'localhost') {
    mySqlConfig.host = '127.0.0.1';
}


// ======================================================
// EXECUTAR INSTRUÇÕES SQL
// ======================================================

function executar(instrucao, parametros) {

    // Verifica se o ambiente foi configurado corretamente
    if (
        process.env.AMBIENTE_PROCESSO !== "producao" &&
        process.env.AMBIENTE_PROCESSO !== "desenvolvimento"
    ) {

        console.log(
            "\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU .env.dev OU app.js\n"
        );

        return Promise.reject(
            new Error("AMBIENTE NÃO CONFIGURADO EM .env")
        );
    }


    return new Promise(function (resolve, reject) {

        // Cria uma conexão com o banco de dados
        var conexao;
        try {
            conexao = mysql.createConnection(mySqlConfig);
        } catch (err) {
            console.error("ERRO AO CRIAR CONEXÃO MySQL:", err);
            return reject(err);
        }

        // ==================================================
        // ESTABELECER CONEXÃO COM O MYSQL
        // ==================================================

        conexao.connect(function (erroConexao) {

            if (erroConexao) {

                // Mensagem clara para quando a conexão é recusada
                console.error("ERRO AO CONECTAR AO MYSQL SERVER:", erroConexao);

                // Anexa uma flag para identificação pelo controller
                erroConexao.isDbConnectionError = true;

                return reject(erroConexao);
            }

            // ==================================================
            // EXECUTAR CONSULTA SQL
            // ==================================================

            var callback = function (erro, resultados) {

                // Encerra a conexão após a consulta
                conexao.end(function (erroFechamento) {
                    if (erroFechamento) {
                        console.error("ERRO AO ENCERRAR CONEXÃO:", erroFechamento);
                    }
                });

                // Verifica se ocorreu erro na consulta
                if (erro) {
                    console.error("ERRO NA CONSULTA SQL:", erro);
                    return reject(erro);
                }

                // Exibe o resultado da consulta no terminal (útil para debug)
                console.log("RESULTADO DA CONSULTA SQL:");
                console.log(resultados);

                return resolve(resultados);
            };

            // ==================================================
            // EXECUTAR COM OU SEM PARÂMETROS
            // ==================================================

            if (parametros && Array.isArray(parametros)) {
                conexao.query(instrucao, parametros, callback);
            } else {
                conexao.query(instrucao, callback);
            }

            // Captura erros no nível da conexão (evita crash silencioso)
            conexao.on('error', function (erro) {
                console.error('ERRO NO MySQL SERVER (on error):', erro);
            });

        });

    });

}


// ======================================================
// CÓDIGO ORIGINAL DO WEB DATA VIZ
// Mantido como referência, mas substituído pela versão
// acima, que trata a conexão antes de executar a consulta.
// ======================================================

/*

function executar(instrucao, parametros) {

    if (
        process.env.AMBIENTE_PROCESSO !== "producao" &&
        process.env.AMBIENTE_PROCESSO !== "desenvolvimento"
    ) {
        console.log(
            "\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n"
        );

        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }

    return new Promise(function (resolve, reject) {

        var conexao = mysql.createConnection(mySqlConfig);

        conexao.connect();

        var callback = function (erro, resultados) {

            conexao.end();

            if (erro) {
                return reject(erro);
            }

            console.log(resultados);

            return resolve(resultados);
        };

        if (parametros && Array.isArray(parametros)) {

            conexao.query(instrucao, parametros, callback);

        } else {

            conexao.query(instrucao, callback);

        }

        conexao.on('error', function (erro) {

            console.error(
                'ERRO NO MySQL SERVER:',
                erro && erro.sqlMessage ? erro.sqlMessage : erro
            );

        });

    });

}

*/


// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    executar
};
