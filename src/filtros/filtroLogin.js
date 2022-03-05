const knex = require('../bancodedados/conexao');
const jwt = require('jsonwebtoken');

const validarUsuarioLogado = async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(400).json('Não autorizado');
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, process.env.SENHA_JWT);

        const verificarUsuario = await knex('usuarios').where({ id }).first();

        if (!verificarUsuario) {
            return res.status(404).json('Usuário não encontrado');
        }

        const { senha, ...user } = verificarUsuario;

        req.usuario = user;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}
module.exports = {
    validarUsuarioLogado
}
