
var usuarioModel = require("../models/usuarioModel");

// Biblioteca para proteger as senhas
var bcrypt = require("bcryptjs");

//  ======================================================
// CÓDIGO ORIGINAL DO WEB DATA VIZ
//Mantido como comentário.
// ======================================================

//

// var aquarioModel = require("../models/aquarioModel");

// function autenticar(req, res) {
//     var email = req.body.emailServer;
//     var senha = req.body.senhaServer;

//     if (email == undefined) {
//         res.status(400).send("Seu email está undefined!");
//     } else if (senha == undefined) {
//         res.status(400).send("Sua senha está indefinida!");
//     } else {

//         usuarioModel.autenticar(email, senha)
//             .then(function (resultadoAutenticar) {

//                 console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
//                 console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

//                 if (resultadoAutenticar.length == 1) {

//                     aquarioModel.buscarAquariosPorEmpresa(resultadoAutenticar[0].empresaId)
//                         .then((resultadoAquarios) => {

//                             if (resultadoAquarios.length > 0) {
//                                 res.json({
//                                     id: resultadoAutenticar[0].id,
//                                     email: resultadoAutenticar[0].email,
//                                     nome: resultadoAutenticar[0].nome,
//                                     senha: resultadoAutenticar[0].senha,
//                                     aquarios: resultadoAquarios
//                                 });
//                             } else {
//                                 res.status(204).json({ aquarios: [] });
//                             }
//                         });

//                 } else if (resultadoAutenticar.length == 0) {
//                     res.status(403).send("Email e/ou senha inválido(s)");
//                 } else {
//                     res.status(403).send("Mais de um usuário com o mesmo login e senha!");
//                 }

//             }).catch(function (erro) {
//                 console.log(erro);
//                 console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
//                 res.status(500).json(erro.sqlMessage);
//             });
//     }
// }


// function cadastrar(req, res) {

//     var nome = req.body.nomeServer;
//     var email = req.body.emailServer;
//     var senha = req.body.senhaServer;
//     var fkEmpresa = req.body.idEmpresaVincularServer;

//     if (nome == undefined) {
//         res.status(400).send("Seu nome está undefined!");
//     } else if (email == undefined) {
//         res.status(400).send("Seu email está undefined!");
//     } else if (senha == undefined) {
//         res.status(400).send("Sua senha está undefined!");
//     } else if (fkEmpresa == undefined) {
//         res.status(400).send("Sua empresa a vincular está undefined!");
//     } else {

//         usuarioModel.cadastrar(nome, email, senha, fkEmpresa)
//             .then(function (resultado) {
//                 res.json(resultado);
//             }).catch(function (erro) {
//                 console.log(erro);
//                 console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
//                 res.status(500).json(erro.sqlMessage);
//             });
//     }
// }

// */


function autenticar(req, res) {

    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!email || !senha) {
        return res.status(400).json({
            mensagem: "Informe seu e-mail e sua senha."
        });
    }

    usuarioModel.autenticar(email)

        .then(function (resultadoAutenticar) {

            if (resultadoAutenticar.length == 0) {
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

            // Não enviamos o hash da senha para o navegador
            res.status(200).json({
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

            console.log(erro);

            res.status(500).json({
                mensagem: "Erro ao realizar a autenticação."
            });

        });
}


// CADASTRAR USUÁRIO

function cadastrar(req, res) {

    var nome = req.body.nomeServer;
    var nacionalidade = req.body.nacionalidadeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    var idReino = req.body.idReinoServer;
    var idTerritorio = req.body.idTerritorioServer;
    var idCla = req.body.idClaServer;


    // Validação dos campos
    if (!nome || !nacionalidade || !email || !senha ||
        !idReino || !idTerritorio || !idCla) {

        return res.status(400).json({
            mensagem: "Preencha todos os campos do cadastro."
        });
    }


    // Transforma a senha em hash
    var senhaCriptografada = bcrypt.hashSync(senha, 10);


    // Envia os dados para o modelo
    usuarioModel.cadastrar(
        nome,
        nacionalidade,
        email,
        senhaCriptografada,
        idReino,
        idTerritorio,
        idCla
    )

        .then(function (resultado) {

            res.status(201).json({
                mensagem: "Cadastro realizado com sucesso!",
                resultado: resultado
            });

        })

        .catch(function (erro) {

            console.log(erro);

            // Código MySQL 1062 = e-mail duplicado
            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    mensagem: "Este e-mail já está cadastrado."
                });
            }

            res.status(500).json({
                mensagem: "Erro ao realizar o cadastro."
            });

        });

}


// ======================================================
// EXPORTAÇÃO
// ======================================================

module.exports = {
    autenticar,
    cadastrar
};
