const knex = require('../bancodedados/conexao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginSchema = require('../validacoes/loginSchema');

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        await loginSchema.validate(req.body);

        const usuario = await knex('usuarios').where({ email }).first();

        if (!usuario) {
            return res.status(404).json("E-mail não cadastrado");
        }

        const validarSenhaBcrypt = await bcrypt.compare(senha, usuario.senha);

        if (!validarSenhaBcrypt) {
            return res.status(401).json('Email ou senha não confere');
        }

        const token = await jwt.sign({ id: usuario.id }, `${process.env.SENHA_JWT}`, { expiresIn: '8h' });

        const { senha: _, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });
    } catch (error) {
        return res.status(400).json(error.message)
    }
}
module.exports = {
    login
}
