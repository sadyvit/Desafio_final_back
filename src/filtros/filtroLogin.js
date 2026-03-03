const knex = require("../bancodedados/conexao");
const jwt = require("jsonwebtoken");

const validarUsuarioLogado = async (req, res, next) => {
  const { authorization } = req.headers;
  const jwtSecret = process.env.SENHA_JWT || process.env.JWT_SECRET;

  if (!authorization) {
    return res.status(401).json("Não autorizado");
  }

  if (!jwtSecret) {
    return res.status(500).json("Segredo JWT não configurado");
  }

  try {
    const token = authorization.replace(/^Bearer\s+/i, "").trim();

    const { id } = jwt.verify(token, jwtSecret);

    const verificarUsuario = await knex("usuarios").where({ id }).first();

    if (!verificarUsuario) {
      return res.status(404).json("Usuário não encontrado");
    }

    const { senha, ...user } = verificarUsuario;

    req.usuario = user;

    next();
  } catch (error) {
    return res.status(401).json("Não autorizado");
  }
};
module.exports = {
  validarUsuarioLogado,
};
