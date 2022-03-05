const yup = require('./yup');

const cadastrarCobrancaSchema = yup.object().shape({
    descricao: yup
        .string()
        .trim()
        .required(),
    status: yup
        .string()
        .trim()
        .required(),
    valor: yup
        .number()
        .required(),
    vencimento: yup
        .date()
        .required(),
});

module.exports = cadastrarCobrancaSchema;