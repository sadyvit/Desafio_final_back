const knex = require("../bancodedados/conexao");
const cadastroClienteSchema = require("../validacoes/cadastroClienteSchema");

const cadastrarCliente = async (req, res) => {

    const {
        nome_cliente,
        email,
        cpf,
        telefone,
        cep,
        logradouro,
        complemento,
        bairro,
        cidade,
        estado } = req.body;

    try {
        if (cpf.split("").some(numero => isNaN(numero))
            || telefone.split("").some(numero => isNaN(numero))
            || (cep && cep.split("").some(numero => isNaN(numero)))) {
            return res.status(400).json("Este campo só aceita números.");
        }
        await cadastroClienteSchema.validate(req.body);

        if (nome_cliente.length < 0) {
            return res.status(401).json('O campo nome deve ser preenchido com um nome válido')
        }

        const verificarEmail = await knex('clientes').where({ email }).first();

        if (verificarEmail) {
            return res.status(401).json("E-mail já cadastrado");
        }

        const verificarCpf = await knex('clientes').where({ cpf }).first();

        if (verificarCpf) {
            return res.status(400).json("Cpf já cadastrado");
        }

        const usuarioCadastrado = await knex('clientes').insert({
            nome_cliente,
            email,
            cpf,
            telefone,
            cep,
            logradouro,
            complemento,
            bairro,
            cidade,
            estado
        }).returning('*');

        if (!usuarioCadastrado) {
            return res.status(400).json("Não foi possível realizar cadastro");
        }

        return res.status(200).json(usuarioCadastrado[0]);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}
const pegarClientes = async (req, res) => {
    const { offset, limit } = req.query;
    try {
        const quantidadeClientes = await knex('clientes').count();
        const clientes = await knex.select('*').from('clientes').limit(limit).offset(offset);
        const cobrancasVencidas = await knex('cobranca').where('status', 'vencida');
        for (let cliente of clientes) {
            if (cobrancasVencidas.find(cobranca => cobranca.cliente_id === cliente.id)) {
                const clienteAtualizado = await knex('clientes').where('id', cliente.id).update('status', false);
            }
            else {
                const clienteAtualizado = await knex('clientes').where('id', cliente.id).update('status', true);
            }
        }

        return res.status(200).json({ quantidadeClientes, clientes });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}
const atualizarCliente = async (req, res) => {

    const {
        nome_cliente,
        email,
        cpf,
        telefone,
        cep,
        logradouro,
        complemento,
        bairro,
        cidade,
        estado } = req.body;

    const { id } = req.params;

    try {
        if (cpf.split("").some(numero => isNaN(numero))
            || telefone.split("").some(numero => isNaN(numero))
            || (cep && cep.split("").some(numero => isNaN(numero)))) {
            return res.status(400).json("Este campo só aceita números.");
        }
        await cadastroClienteSchema.validate(req.body);

        const clienteEmail = await knex('clientes').where({ email }).first();
        const clienteCpf = await knex('clientes').where({ cpf }).first();

        if (clienteEmail != undefined && id != clienteEmail?.id) {
            return res.status(400).json("Email já cadastrado para outro cliente");
        }

        if (clienteCpf != undefined && id != clienteCpf?.id) {
            return res.status(400).json("Cpf já cadastrado para outro cliente");
        }

        const atualizarCliente = await knex('clientes').where({ id }).update({
            nome_cliente,
            email,
            cpf,
            telefone,
            cep,
            logradouro,
            complemento,
            bairro,
            cidade,
            estado
        }).returning('*');

        const cobrancasVencidas = await knex('cobranca').where('status', 'vencida');
        if (cobrancasVencidas.find(cobranca => cobranca.cliente_id === id)) {
            const clienteAtualizado = await knex('clientes').where('id', id).update('status', false);
        }
        else {
            const clienteAtualizado = await knex('clientes').where('id', id).update('status', true);
        }

        if (!atualizarCliente) {
            return res.status(400).json("Não foi possível atualizar o cliente")
        }

        return res.status(200).json(atualizarCliente);
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const cliente = await knex('clientes').where({ id }).first();

        if (!cliente) {
            return res.status(404).json("Não foi possível encontrar o cliente");
        }

        const cobrancasVencidas = await knex('cobranca').where('status', 'vencida');
        if (cobrancasVencidas.find(cobranca => cobranca.cliente_id === id)) {
            const clienteAtualizado = await knex('clientes').where({ id }).update('status', false);
        }
        else {
            const clienteAtualizado = await knex('clientes').where({ id }).update('status', true);
        }

        return res.status(200).json(cliente);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}


const buscarCliente = async (req, res) => {
    const { busca } = req.query;

    try {
        const buscaCliente = await knex('clientes')
            .whereRaw('email ILIKE ?', `%${busca}%`)
            .orWhereRaw('nome_cliente ILIKE ?', `%${busca}%`)
            .orWhereRaw('cpf::text ILIKE ?', `%${busca}%`);

        if (!buscaCliente) {
            return res.status(400).json(buscaCliente);
        }
        return res.status(200).json(buscaCliente);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarCliente,
    pegarClientes,
    atualizarCliente,
    obterCliente,
    buscarCliente
}
