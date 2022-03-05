const yup = require('./yup');

const cadastroUsuarioSchema = yup.object().shape({
    nome_usuario: yup
        .string()
        .trim()
        .required()
        .min(2),
    email: yup
        .string()
        .trim()
        .email()
        .required(),
    senha: yup
        .string()
        .trim()
        .required()
        .min(5)
});

module.exports = cadastroUsuarioSchema;