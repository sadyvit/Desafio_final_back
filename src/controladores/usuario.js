const knex = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');

const cadastroUsuarioSchema = require('../validacoes/cadastroUsuarioSchema');
const editarUsuarioSchema = require('../validacoes/editarUsuarioSchema');

const cadastrarUsuario = async (req, res) => {

    const { nome_usuario, email, senha } = req.body;


    try {
        await cadastroUsuarioSchema.validate(req.body);

        if (nome_usuario.length < 0) {
            return res.status(401).json('O campo nome deve ser preenchido com um nome válido');
        }

        const existeEmail = await knex('usuarios').where({ email }).first();

        if (existeEmail) {
            return res.status(400).json("E-mail já cadastrado no sistema");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuarios').insert({
            nome_usuario,
            email,
            senha: senhaCriptografada
        }).returning('*');

        if (!usuario) {
            return res.status(400).json("Não foi possível cadastrar o usuário");
        }

        return res.status(200).json(usuario[0]);

    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const editarUsuario = async (req, res) => {

    const { nome_usuario, email, senha, cpf, telefone } = req.body;
    const { id } = req.usuario;


    try {
        if (cpf.split("").some(numero => isNaN(numero)) || telefone.split("").some(numero => isNaN(numero))) {
            return res.status(400).json("Este campo só aceita números.");
        }

        await editarUsuarioSchema.validate(req.body);

        const usuarioEmail = await knex('usuarios').where({ email }).first();

        if (usuarioEmail != undefined && id != usuarioEmail?.id) {
            return res.status(400).json("Email já cadastrado para outro usuario")
        }

        if (senha) {
            const senhaHash = await bcrypt.hash(senha, 10)

            const cadastrarSenha = await knex('usuarios').where({ id }).update({
                senha: senhaHash
            });

            if (!senhaHash) {
                return res.status(400).json("Não foi possível atualizar o cadastro");
            }
        }

        const atualizarUsuario = await knex('usuarios').where({ id }).update({
            nome_usuario,
            email,
            cpf,
            telefone
        }).returning('*');

        if (!atualizarUsuario) {
            return res.status(400).json("Não foi possível atualizar o cadastro");
        }

        return res.status(200).json(atualizarUsuario);

    } catch (error) {
        return res.status(401).json(error.message);
    }
}

const pegarUsuario = async (req, res) => {
    const { id } = req.usuario;

    try {
        const usuario = await knex('usuarios').where({ id }).first();

        if (!usuario) {
            return res.status(404).json("Não foi possível encontrar o usuário");
        }

        return res.status(200).json(usuario);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    editarUsuario,
    pegarUsuario

}
