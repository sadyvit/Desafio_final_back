const yup = require('./yup');

const cadastroClienteSchema = yup.object().shape({
    nome_cliente: yup
        .string()
        .trim()
        .required()
        .min(2),
    email: yup
        .string()
        .trim()
        .email()
        .required(),
    cpf: yup
        .string()
        .trim()
        .required()
        .min(11),
    telefone: yup
        .string()
        .trim()
        .required()
        .min(8),
    cep: yup
        .string()
        .trim(),
    logradouro: yup
        .string()
        .trim(),
    complemento: yup
        .string()
        .trim(),
    bairro: yup
        .string()
        .trim(),
    cidade: yup
        .string()
        .trim(),
    estado: yup
        .string()
        .trim()
        .uppercase()
        .max(2)
});

module.exports = cadastroClienteSchema;