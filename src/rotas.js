const express = require('express');

const usuarios = require('./controladores/usuario');
const login = require('./controladores/login');
const clientes = require('./controladores/clientes');
const cobrancas = require('./controladores/cobrancas');

const { validarUsuarioLogado } = require('./filtros/filtroLogin');

const rotas = express.Router();

rotas.post("/usuario", usuarios.cadastrarUsuario);
rotas.post("/login", login.login);

rotas.get("/cobrancas/busca", cobrancas.buscarCobrancas);
rotas.get("/clientes/busca", clientes.buscarCliente);

rotas.post("/clientes", clientes.cadastrarCliente);
rotas.post("/cobrancas/:id", cobrancas.cadastrarCobranca);

rotas.get("/clientes", clientes.pegarClientes);
rotas.get("/cobrancas", cobrancas.listarCobrancas);

rotas.put("/clientes/:id", clientes.atualizarCliente);
rotas.put("/cobrancas/:id", cobrancas.editarCobranca);

rotas.get("/clientes/:id", clientes.obterCliente);
rotas.get("/cobrancas/:id", cobrancas.obterCobranca);

rotas.get("/cobranca/:id", cobrancas.cobrancaEspecifica);

rotas.delete("/cobrancas/:id", cobrancas.excluirCobranca);

rotas.use(validarUsuarioLogado);
rotas.get("/usuario", usuarios.pegarUsuario);
rotas.put("/usuario", usuarios.editarUsuario);



module.exports = rotas;
