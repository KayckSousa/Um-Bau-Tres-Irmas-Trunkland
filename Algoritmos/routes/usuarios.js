var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

// Estatísticas da Dashboard
router.get("/estatisticas", function (req, res) {
    usuarioController.estatisticas(req, res);
});

// Cadastro
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

// Login
router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

module.exports = router;