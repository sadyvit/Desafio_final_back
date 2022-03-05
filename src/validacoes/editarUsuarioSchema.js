const yup = require('./yup');

const editarUsuarioSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .email()
        .required(),
    senha: yup
        .string()
        .trim()
        .min(5),
    nome_usuario: yup
        .string()
        .trim()
        .min(2)
        .required(),
    cpf: yup
        .string()
        .trim()
        .nullable(),
    telefone: yup
        .string()
        .trim()
        .nullable()
});

module.exports = editarUsuarioSchema;