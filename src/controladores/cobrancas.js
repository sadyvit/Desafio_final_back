const knex = require("../bancodedados/conexao");
const cadastrarCobrancaSchema = require("../validacoes/cadastrarCobrancaSchema");


const cadastrarCobranca = async (req, res) => {

    const { descricao, status, valor, vencimento } = req.body;
    const { id } = req.params;

    try {
        await cadastrarCobrancaSchema.validate(req.body);
        const cliente = await knex('clientes').where({ id }).first();

        if (!cliente) {
            return res.status(404).json("cliente não encontrado");
        }

        const cadastroCobranca = await knex('cobranca').where({ id }).insert({
            descricao,
            cliente_id: id,
            status: new Date(vencimento.split('-')[0], (vencimento.split('-')[1] - 1), vencimento.split('-')[2], 23, 59, 59) < new Date() && status !== 'paga' ? 'vencida' : status,
            valor,
            vencimento: new Date(vencimento.split('-')[0], (vencimento.split('-')[1] - 1), vencimento.split('-')[2], 23, 59, 59)
        }).returning('*');

        let statusCliente = new Date(vencimento.split('-')[0], (vencimento.split('-')[1] - 1), vencimento.split('-')[2], 23, 59, 59) < new Date() && status !== 'paga' ? false : true;

        if (!statusCliente) {
            const clienteAtualizado = await knex('clientes').update({ status: statusCliente }).where({ id });
        }

        if (!cadastroCobranca) {
            return res.status(400).json("Não foi possível cadastrar a cobrança");
        }

        return res.status(200).json(cadastroCobranca);
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}


const listarCobrancas = async (req, res) => {
    const { offset, limit } = req.query;
    try {
        const quantidadeCobrancas = await knex('cobranca').count();
        const cobrancas = await knex.select('nome_cliente', 'cobranca.id', 'cobranca.cliente_id', 'cobranca.valor', 'cobranca.vencimento', 'cobranca.status', 'cobranca.descricao').from('clientes').innerJoin('cobranca', 'clientes.id', 'cobranca.cliente_id').limit(limit).offset(offset);

        if (!cobrancas.length) {
            return res.status(400).json();
        }

        const atualizarCobrancas = await knex('cobranca').where('vencimento', '<', new Date()).andWhere('status', 'pendente').update({ status: 'vencida' });

        return res.status(200).json({ quantidadeCobrancas, cobrancas });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterCobranca = async (req, res) => {
    const { id } = req.params;

    try {
        const cobranca = await knex('cobranca').where({ cliente_id: id });

        if (!cobranca) {
            return res.status(404).json("Não foi possível encontrar as cobranças do cliente");
        }

        return res.status(200).json(cobranca);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirCobranca = async (req, res) => {
    const { id } = req.params;

    try {
        const cobranca = await knex('cobranca').where({ id }).first();

        console.log(cobranca);

        if (!cobranca) {
            return res.status(404).json("Não foi possível encontrar a cobrança");
        }

        if (cobranca.status === "pago" || cobranca.status === "vencida") {
            return res.status(400).json('Cobranças pagas ou vencidas não podem ser excluídas');
        }
        const exclusaoCobranca = await knex('cobranca').del().where('id', id);

        const cobrancasVencidas = await knex('cobranca').where('status', 'vencida');
        if (cobrancasVencidas.find(c => c.cliente_id === cobranca.cliente_id)) {
            const clienteAtualizado = await knex('clientes').where({ id }).update('status', false);
        }
        else {
            const clienteAtualizado = await knex('clientes').where({ id }).update('status', true);
        }

        if (!exclusaoCobranca) {
            return res.status(400).json("Não foi possível excluir a cobrança");
        }
        return res.status(200).json(exclusaoCobranca);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cobrancaEspecifica = async (req, res) => {
    const { id } = req.params;

    try {
        const cobranca = await knex('cobranca').where({ id });

        if (!cobranca) {
            return res.status(404).json("Não foi possível encontrar a cobrança ");
        }

        return res.status(200).json(cobranca);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const buscarCobrancas = async (req, res) => {
    const { busca } = req.query;

    try {
        let conteudo = knex('cobranca')
            .select('nome_cliente', 'cobranca.id', 'cobranca.valor', 'cobranca.vencimento', 'cobranca.status', 'cobranca.descricao')
            .innerJoin('clientes', 'clientes.id', 'cobranca.cliente_id');

        if (!isNaN(Number(busca))) {
            conteudo = conteudo.whereRaw('cobranca.id::text ILIKE ?', [`${busca}%`]);
        } else {
            conteudo = conteudo.whereILike('nome_cliente', `%${busca}%`);
        }

        return res.status(200).json(await conteudo);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const editarCobranca = async (req, res) => {
    const {
        cliente_id,
        descricao,
        status,
        valor,
        vencimento } = req.body;

    const { id } = req.params;

    try {
        if (isNaN(valor)) {
            return res.status(400).json("Este campo só aceita números.");
        }
        await cadastrarCobrancaSchema.validate(req.body);

        if (!descricao) {
            return res.status(400).json("digite uma descrição");
        }

        if (!status) {
            return res.status(400).json("este campo é obrigatório");
        }

        const atualizarCobranca = await knex('cobranca').where({ id }).update({
            cliente_id,
            descricao,
            status: new Date(vencimento.split('-')[0], (vencimento.split('-')[1] - 1), vencimento.split('-')[2], 23, 59, 59) < new Date() && status !== 'paga' ? 'vencida' : status,
            valor,
            vencimento: new Date(vencimento.split('-')[0], (vencimento.split('-')[1] - 1), vencimento.split('-')[2], 23, 59, 59)
        }).returning('*');

        let statusCliente = new Date(vencimento.split('-')[0], (vencimento.split('-')[1] - 1), vencimento.split('-')[2], 23, 59, 59) < new Date() && status !== 'paga' ? false : true;

        if (!statusCliente) {
            const clienteAtualizado = await knex('clientes').update({ status: statusCliente }).where({ id: cliente_id });
        }

        if (!atualizarCobranca) {
            return res.status(400).json("Não foi possível atualizar a cobranca")
        }

        return res.status(200).json(atualizarCobranca);
    }
    catch (error) {
        console.log(error);
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarCobranca,
    listarCobrancas,
    obterCobranca,
    excluirCobranca,
    buscarCobrancas,
    cobrancaEspecifica,
    editarCobranca
}
