const yup = require('./yup');

const loginSchema = yup.object().shape({
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

module.exports = loginSchema;