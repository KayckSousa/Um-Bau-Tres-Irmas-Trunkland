
/* ======================================================
   CONFIGURAÇÃO DO AMBIENTE
   ====================================================== */

// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

// Carrega as configurações do arquivo .env escolhido
require("dotenv").config({ path: caminho_env });

process.env.AMBIENTE_PROCESSO = ambiente_processo;


// ======================================================
// IMPORTAÇÃO DAS BIBLIOTECAS
// ======================================================

var express = require("express");
var cors = require("cors");
var path = require("path");

var app = express();


// ======================================================
// CONFIGURAÇÃO DO SERVIDOR
// ======================================================

var PORTA_APP = process.env.APP_PORT || 3000;
var HOST_APP = process.env.APP_HOST || "localhost";

// Permite receber informações em JSON
app.use(express.json());

// Permite receber informações de formulários
app.use(express.urlencoded({ extended: false }));

// Permite comunicação entre diferentes origens
app.use(cors());

// Disponibiliza HTML, CSS, JavaScript e imagens
// Os arquivos do Trunkland estão diretamente na raiz do projeto
app.use(express.static(__dirname));


// ======================================================
// IMPORTAÇÃO DAS ROTAS
// ======================================================

// Rota principal do WEB DATA VIZ
var indexRouter = require("./routes/index");

// Rota de usuários do Trunkland
var usuarioRouter = require("./routes/usuarios");


// ======================================================
// ROTAS ATIVAS DO TRUNKLAND
// ======================================================

// Página inicial
app.use("/", indexRouter);

// Cadastro e autenticação de usuários
app.use("/usuarios", usuarioRouter);


// ======================================================
// ROTAS DO WEB DATA VIZ
// Mantidas comentadas para consulta e reaproveitamento
// ======================================================

// var avisosRouter = require("./src/routes/avisos");
// var medidasRouter = require("./src/routes/medidas");
// var aquariosRouter = require("./src/routes/aquarios");
// var empresasRouter = require("./src/routes/empresas");
// var especiesRouter = require("./src/routes/especies");

// app.use("/avisos", avisosRouter);
// app.use("/medidas", medidasRouter);
// app.use("/aquarios", aquariosRouter);
// app.use("/empresas", empresasRouter);
// app.use("/especies", especiesRouter);


// ======================================================
// INICIALIZAÇÃO DO SERVIDOR
// ======================================================

app.listen(PORTA_APP, function () {

    console.log(`
    ==========================================
                  TRUNKLAND
    ==========================================

    Servidor iniciado com sucesso!

    Acesse: http://${HOST_APP}:${PORTA_APP}

    Ambiente: ${ambiente_processo}

    Banco de dados: MySQL - Trunkland

    ==========================================
    `);

});


// app.listen(PORTA_APP, function () {
    //     console.log(`
//     ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
//     ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
//     ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
//     ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
//     #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
//     ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
//     ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
//     \n\n\n                                                                                                 
//     Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
//     Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
//     \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
//     \tSe .:producao:. você está se conectando ao banco remoto. \n\n
//     \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
// });