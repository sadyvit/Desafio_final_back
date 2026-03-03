const knex = require("../bancodedados/conexao");
const cadastrarCobrancaSchema = require("../validacoes/cadastrarCobrancaSchema");

const parsePagination = (query) => {
  const limitParsed = Number.parseInt(query.limit, 10);
  const offsetParsed = Number.parseInt(query.offset, 10);

  const limit = Number.isInteger(limitParsed) && limitParsed > 0 ? limitParsed : 1000;
  const offset = Number.isInteger(offsetParsed) && offsetParsed >= 0 ? offsetParsed : 0;

  return { limit, offset };
};

const toEndOfDay = (dateString) => {
  const [year, month, day] = String(dateString).split("-").map(Number);
  return new Date(year, month - 1, day, 23, 59, 59);
};

const normalizeStatusByDueDate = (vencimento, status) => {
  const vencimentoDate = toEndOfDay(vencimento);
  if (vencimentoDate < new Date() && status !== "paga") return "vencida";
  return status;
};

const atualizarStatusCliente = async (clienteId) => {
  const existeVencida = await knex("cobranca")
    .where({ cliente_id: clienteId, status: "vencida" })
    .first();

  await knex("clientes")
    .where({ id: clienteId })
    .update({ status: !!existeVencida });
};

const cadastrarCobranca = async (req, res) => {
  const { descricao, status, valor, vencimento } = req.body;
  const { id } = req.params; // id do cliente na rota /cobrancas/:id

  try {
    await cadastrarCobrancaSchema.validate(req.body);

    const cliente = await knex("clientes").where({ id }).first();
    if (!cliente) {
      return res.status(404).json("Cliente não encontrado");
    }

    if (isNaN(Number(valor))) {
      return res.status(400).json("Este campo só aceita números.");
    }

    const statusFinal = normalizeStatusByDueDate(vencimento, status);
    const vencimentoFinal = toEndOfDay(vencimento);

    const [cadastroCobranca] = await knex("cobranca")
      .insert({
        descricao,
        cliente_id: id,
        status: statusFinal,
        valor,
        vencimento: vencimentoFinal,
      })
      .returning("*");

    if (!cadastroCobranca) {
      return res.status(400).json("Não foi possível cadastrar a cobrança");
    }

    await atualizarStatusCliente(id);

    return res.status(201).json(cadastroCobranca);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const listarCobrancas = async (req, res) => {
  try {
    const { limit, offset } = parsePagination(req.query);

    await knex("cobranca")
      .where("vencimento", "<", new Date())
      .andWhere("status", "pendente")
      .update({ status: "vencida" });

    const quantidadeCobrancas = await knex("cobranca").count({ count: "*" });

    const cobrancas = await knex("clientes")
      .select(
        "clientes.nome_cliente",
        "cobranca.id",
        "cobranca.cliente_id",
        "cobranca.valor",
        "cobranca.vencimento",
        "cobranca.status",
        "cobranca.descricao"
      )
      .innerJoin("cobranca", "clientes.id", "cobranca.cliente_id")
      .limit(limit)
      .offset(offset);

    return res.status(200).json({ quantidadeCobrancas, cobrancas });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterCobranca = async (req, res) => {
  const { id } = req.params; // id do cliente

  try {
    const cobrancas = await knex("cobranca").where({ cliente_id: id });
    return res.status(200).json(cobrancas);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const excluirCobranca = async (req, res) => {
  const { id } = req.params; // id da cobrança

  try {
    const cobranca = await knex("cobranca").where({ id }).first();
    if (!cobranca) {
      return res.status(404).json("Não foi possível encontrar a cobrança");
    }

    if (cobranca.status === "paga" || cobranca.status === "vencida") {
      return res
        .status(400)
        .json("Cobranças pagas ou vencidas não podem ser excluídas");
    }

    const exclusaoCobranca = await knex("cobranca").where({ id }).del();
    if (!exclusaoCobranca) {
      return res.status(400).json("Não foi possível excluir a cobrança");
    }

    await atualizarStatusCliente(cobranca.cliente_id);

    return res.status(200).json("Cobrança excluída com sucesso");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const cobrancaEspecifica = async (req, res) => {
  const { id } = req.params; // id da cobrança

  try {
    const cobranca = await knex("cobranca").where({ id }).first();
    if (!cobranca) {
      return res.status(404).json("Não foi possível encontrar a cobrança");
    }

    return res.status(200).json(cobranca);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const buscarCobrancas = async (req, res) => {
  const { busca = "" } = req.query;

  try {
    let conteudo = knex("cobranca")
      .select(
        "clientes.nome_cliente",
        "cobranca.id",
        "cobranca.valor",
        "cobranca.vencimento",
        "cobranca.status",
        "cobranca.descricao"
      )
      .innerJoin("clientes", "clientes.id", "cobranca.cliente_id");

    if (!isNaN(Number(busca))) {
      conteudo = conteudo.whereRaw("cobranca.id::text ILIKE ?", [`${busca}%`]);
    } else {
      conteudo = conteudo.whereILike("clientes.nome_cliente", `%${busca}%`);
    }

    const resultado = await conteudo;
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const editarCobranca = async (req, res) => {
  const { cliente_id, descricao, status, valor, vencimento } = req.body;
  const { id } = req.params; // id da cobrança

  try {
    await cadastrarCobrancaSchema.validate(req.body);

    if (isNaN(Number(valor))) {
      return res.status(400).json("Este campo só aceita números.");
    }

    const cobrancaAtual = await knex("cobranca").where({ id }).first();
    if (!cobrancaAtual) {
      return res.status(404).json("Cobrança não encontrada");
    }

    const clienteDestinoId = cliente_id || cobrancaAtual.cliente_id;
    const clienteDestino = await knex("clientes").where({ id: clienteDestinoId }).first();
    if (!clienteDestino) {
      return res.status(404).json("Cliente não encontrado");
    }

    const statusFinal = normalizeStatusByDueDate(vencimento, status);
    const vencimentoFinal = toEndOfDay(vencimento);

    const [atualizarCobranca] = await knex("cobranca")
      .where({ id })
      .update({
        cliente_id: clienteDestinoId,
        descricao,
        status: statusFinal,
        valor,
        vencimento: vencimentoFinal,
      })
      .returning("*");

    if (!atualizarCobranca) {
      return res.status(400).json("Não foi possível atualizar a cobrança");
    }

    await atualizarStatusCliente(clienteDestinoId);
    if (String(cobrancaAtual.cliente_id) !== String(clienteDestinoId)) {
      await atualizarStatusCliente(cobrancaAtual.cliente_id);
    }

    return res.status(200).json(atualizarCobranca);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  cadastrarCobranca,
  listarCobrancas,
  obterCobranca,
  excluirCobranca,
  buscarCobrancas,
  cobrancaEspecifica,
  editarCobranca,
};