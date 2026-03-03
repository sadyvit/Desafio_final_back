const express = require("express");

const usuarios = require("./controladores/usuario");
const login = require("./controladores/login");
const clientes = require("./controladores/clientes");
const cobrancas = require("./controladores/cobrancas");

const { validarUsuarioLogado } = require("./filtros/filtroLogin");

const rotas = express.Router();

rotas.get("/", (req, res) => {
	return res.status(200).json({ status: "ok" });
});

rotas.post("/usuario", usuarios.cadastrarUsuario);
rotas.post("/login", login.login);

// Middleware de autenticação para as rotas abaixo
rotas.use(validarUsuarioLogado);

rotas.get("/cobrancas/busca", cobrancas.buscarCobrancas);
rotas.get("/clientes/busca", clientes.buscarCliente);

rotas.post("/clientes", clientes.cadastrarCliente);
rotas.post("/cobrancas", cobrancas.cadastrarCobranca);

rotas.get("/clientes", clientes.pegarClientes);
rotas.get("/cobrancas", cobrancas.listarCobrancas);

rotas.put("/clientes/:id", clientes.atualizarCliente);
rotas.put("/cobrancas/:id", cobrancas.editarCobranca);

rotas.get("/clientes/:id", clientes.obterCliente);
rotas.get("/cobrancas/:id", cobrancas.obterCobranca);

rotas.delete("/cobrancas/:id", cobrancas.excluirCobranca);

rotas.get("/usuario", usuarios.pegarUsuario);
rotas.put("/usuario", usuarios.editarUsuario);

module.exports = rotas;
