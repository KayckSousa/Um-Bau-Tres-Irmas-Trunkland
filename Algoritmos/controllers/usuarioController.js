
var usuarioModel = require("../models/usuarioModel");

// Biblioteca para proteger as senhas
var bcrypt = require("bcryptjs");


// ======================================================
// CÓDIGO ORIGINAL DO WEB DATA VIZ
// Mantido como comentário para consulta.
// ======================================================

/*

var aquarioModel = require("../models/aquarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(function (resultadoAutenticar) {

                console.log(`Resultados encontrados: ${resultadoAutenticar.length}`);

                if (resultadoAutenticar.length == 1) {

                    aquarioModel.buscarAquariosPorEmpresa(resultadoAutenticar[0].empresaId)
                        .then((resultadoAquarios) => {

                            if (resultadoAquarios.length > 0) {
                                res.json({
                                    id: resultadoAutenticar[0].id,
                                    email: resultadoAutenticar[0].email,
                                    nome: resultadoAutenticar[0].nome,
                                    senha: resultadoAutenticar[0].senha,
                                    aquarios: resultadoAquarios
                                });
                            } else {
                                res.status(204).json({ aquarios: [] });
                            }
                        });

                } else if (resultadoAutenticar.length == 0) {
                    res.status(403).send("Email e/ou senha inválido(s)");
                } else {
                    res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                }

            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function cadastrar(req, res) {

    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var fkEmpresa = req.body.idEmpresaVincularServer;

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (fkEmpresa == undefined) {
        res.status(400).send("Sua empresa a vincular está undefined!");
    } else {

        usuarioModel.cadastrar(nome, email, senha, fkEmpresa)
            .then(function (resultado) {
                res.json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

*/


// ======================================================
// CÓDIGO ADAPTADO PARA O TRUNKLAND
// ======================================================


// ======================================================
// AUTENTICAR USUÁRIO
// ======================================================

function autenticar(req, res) {

    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    // Verifica se os campos foram preenchidos
    if (!email || !senha) {
        return res.status(400).json({
            mensagem: "Informe seu e-mail e sua senha."
        });
    }

    // Busca o usuário pelo e-mail
    usuarioModel.autenticar(email)

        .then(function (resultadoAutenticar) {

            // Verifica se o usuário existe
            if (resultadoAutenticar.length === 0) {
                return res.status(403).json({
                    mensagem: "E-mail ou senha inválidos."
                });
            }

            var usuario = resultadoAutenticar[0];

            // Compara a senha digitada com o hash armazenado
            var senhaCorreta = bcrypt.compareSync(senha, usuario.senha);

            if (!senhaCorreta) {
                return res.status(403).json({
                    mensagem: "E-mail ou senha inválidos."
                });
            }

            // Não envia o hash da senha para o navegador
            return res.status(200).json({
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                nacionalidade: usuario.nacionalidade,
                email: usuario.email,
                id_reino: usuario.id_reino,
                id_territorio: usuario.id_territorio,
                id_cla: usuario.id_cla
            });

        })

        .catch(function (erro) {

            console.log("Erro ao realizar autenticação:", erro);

            return res.status(500).json({
                mensagem: "Erro ao realizar a autenticação."
            });

        });
}


// ======================================================
// CADASTRAR USUÁRIO
// ======================================================

function cadastrar(req, res) {

    var nome = req.body.nomeServer;
    var nacionalidade = req.body.nacionalidadeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    // Converte os IDs recebidos para números
    var idReino = Number(req.body.idReinoServer);
    var idTerritorio = Number(req.body.idTerritorioServer);
    var idCla = Number(req.body.idClaServer);


    // Verifica se todos os campos foram preenchidos
    if (
        !nome ||
        !nacionalidade ||
        !email ||
        !senha ||
        !req.body.idReinoServer ||
        !req.body.idTerritorioServer ||
        !req.body.idClaServer
    ) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos do cadastro."
        });
    }


    // Verifica se os IDs são números inteiros positivos
    if (
        !Number.isInteger(idReino) || idReino <= 0 ||
        !Number.isInteger(idTerritorio) || idTerritorio <= 0 ||
        !Number.isInteger(idCla) || idCla <= 0
    ) {
        return res.status(400).json({
            mensagem: "Selecione um reino, território e clã válidos."
        });
    }


    // Verifica se o território pertence ao reino selecionado
    usuarioModel.verificarTerritorioReino(idTerritorio, idReino)

        .then(function (resultadoVerificacao) {

            // Interrompe o cadastro se a associação não existir
            if (resultadoVerificacao.length === 0) {

                var erro = new Error(
                    "O território não pertence ao reino selecionado."
                );

                erro.codigoTrunkland = "TERRITORIO_INVALIDO";

                throw erro;
            }

            // Criptografa a senha antes de armazená-la
            var senhaCriptografada = bcrypt.hashSync(senha, 10);

            // Envia os dados para o model cadastrar no banco
            return usuarioModel.cadastrar(
                nome,
                nacionalidade,
                email,
                senhaCriptografada,
                idReino,
                idTerritorio,
                idCla
            );

        })

        .then(function (resultado) {

            // Cadastro concluído
            return res.status(201).json({
                mensagem: "Cadastro realizado com sucesso!",
                resultado: resultado
            });

        })

        .catch(function (erro) {

            console.log("Erro ao realizar cadastro:", erro);

            // Território não pertence ao reino selecionado
            if (erro.codigoTrunkland === "TERRITORIO_INVALIDO") {
                return res.status(400).json({
                    mensagem: "O território selecionado não pertence ao reino escolhido."
                });
            }

            // Código MySQL 1062 = e-mail duplicado
            if (erro.code === "ER_DUP_ENTRY" || erro.errno === 1062) {
                return res.status(409).json({
                    mensagem: "Este e-mail já está cadastrado."
                });
            }

            // Código MySQL 1452 = chave estrangeira inexistente
            if (erro.code === "ER_NO_REFERENCED_ROW_2" || erro.errno === 1452) {
                return res.status(400).json({
                    mensagem: "Reino, território ou clã não encontrado no banco de dados."
                });
            }

            return res.status(500).json({
                mensagem: "Erro ao realizar o cadastro."
            });

        });
}


// ======================================================
// ESTATÍSTICAS DA DASHBOARD
// ======================================================

function estatisticas(req, res) {

    // Executa as quatro consultas ao banco de dados
    Promise.all([
        usuarioModel.contarUsuarios(),
        usuarioModel.usuariosPorReino(),
        usuarioModel.usuariosPorTerritorio(),
        usuarioModel.usuariosPorCla()
    ])

        .then(function (resultados) {

            // Organiza os resultados recebidos
            var totalUsuarios = resultados[0][0].total;

            var porReino = resultados[1];
            var porTerritorio = resultados[2];
            var porCla = resultados[3];

            // Envia os dados para o HTML
            return res.status(200).json({
                totalUsuarios: totalUsuarios,
                porReino: porReino,
                porTerritorio: porTerritorio,
                porCla: porCla
            });

        })

        .catch(function (erro) {

            console.log("Erro ao buscar estatísticas:", erro);

            return res.status(500).json({
                mensagem: "Erro ao carregar as estatísticas da Dashboard."
            });

        });
}


// ======================================================
// EXPORTAÇÃO DAS FUNÇÕES
// ======================================================

module.exports = {
    autenticar,
    cadastrar,
    estatisticas
};
