const knex = require("../bancodedados/conexao");
const cadastroClienteSchema = require("../validacoes/cadastroClienteSchema");

const sanitizeDigits = (value) =>
  value === undefined || value === null ? "" : String(value).replace(/\D/g, "");

const parsePagination = (query) => {
  const limitParsed = Number.parseInt(query.limit, 10);
  const offsetParsed = Number.parseInt(query.offset, 10);

  const limit = Number.isInteger(limitParsed) && limitParsed > 0 ? limitParsed : 1000;
  const offset = Number.isInteger(offsetParsed) && offsetParsed >= 0 ? offsetParsed : 0;

  return { limit, offset };
};

const atualizarStatusClientePorId = async (id) => {
  const existeVencida = await knex("cobranca")
    .where({ cliente_id: id, status: "vencida" })
    .first();

  await knex("clientes")
    .where({ id })
    .update({ status: !!existeVencida });
};

const cadastrarCliente = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      cpf: sanitizeDigits(req.body.cpf),
      telefone: sanitizeDigits(req.body.telefone),
      cep: sanitizeDigits(req.body.cep),
    };

    await cadastroClienteSchema.validate(payload);

    if (!payload.nome_cliente || payload.nome_cliente.trim().length < 2) {
      return res.status(400).json("O campo nome deve ser preenchido com um nome válido");
    }

    const verificarEmail = await knex("clientes").where({ email: payload.email }).first();
    if (verificarEmail) {
      return res.status(409).json("E-mail já cadastrado");
    }

    const verificarCpf = await knex("clientes").where({ cpf: payload.cpf }).first();
    if (verificarCpf) {
      return res.status(409).json("Cpf já cadastrado");
    }

    const [usuarioCadastrado] = await knex("clientes")
      .insert({
        nome_cliente: payload.nome_cliente,
        email: payload.email,
        cpf: payload.cpf,
        telefone: payload.telefone,
        cep: payload.cep || null,
        logradouro: payload.logradouro || null,
        complemento: payload.complemento || null,
        bairro: payload.bairro || null,
        cidade: payload.cidade || null,
        estado: payload.estado || null,
      })
      .returning("*");

    if (!usuarioCadastrado) {
      return res.status(400).json("Não foi possível realizar cadastro");
    }

    return res.status(201).json(usuarioCadastrado);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const pegarClientes = async (req, res) => {
  try {
    const { limit, offset } = parsePagination(req.query);

    const quantidadeClientes = await knex("clientes").count({ count: "*" });
    const clientes = await knex("clientes").select("*").limit(limit).offset(offset);

    for (const cliente of clientes) {
      await atualizarStatusClientePorId(cliente.id);
    }

    const clientesAtualizados = await knex("clientes")
      .select("*")
      .limit(limit)
      .offset(offset);

    return res.status(200).json({ quantidadeClientes, clientes: clientesAtualizados });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const atualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const payload = {
      ...req.body,
      cpf: sanitizeDigits(req.body.cpf),
      telefone: sanitizeDigits(req.body.telefone),
      cep: sanitizeDigits(req.body.cep),
    };

    await cadastroClienteSchema.validate(payload);

    const clienteEmail = await knex("clientes").where({ email: payload.email }).first();
    const clienteCpf = await knex("clientes").where({ cpf: payload.cpf }).first();

    if (clienteEmail && String(id) !== String(clienteEmail.id)) {
      return res.status(409).json("Email já cadastrado para outro cliente");
    }

    if (clienteCpf && String(id) !== String(clienteCpf.id)) {
      return res.status(409).json("Cpf já cadastrado para outro cliente");
    }

    const [clienteAtualizado] = await knex("clientes")
      .where({ id })
      .update({
        nome_cliente: payload.nome_cliente,
        email: payload.email,
        cpf: payload.cpf,
        telefone: payload.telefone,
        cep: payload.cep || null,
        logradouro: payload.logradouro || null,
        complemento: payload.complemento || null,
        bairro: payload.bairro || null,
        cidade: payload.cidade || null,
        estado: payload.estado || null,
      })
      .returning("*");

    if (!clienteAtualizado) {
      return res.status(400).json("Não foi possível atualizar o cliente");
    }

    await atualizarStatusClientePorId(id);

    return res.status(200).json(clienteAtualizado);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await knex("clientes").where({ id }).first();
    if (!cliente) {
      return res.status(404).json("Não foi possível encontrar o cliente");
    }

    await atualizarStatusClientePorId(id);

    const clienteAtualizado = await knex("clientes").where({ id }).first();
    return res.status(200).json(clienteAtualizado);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const buscarCliente = async (req, res) => {
  try {
    const { busca = "" } = req.query;

    const buscaCliente = await knex("clientes")
      .whereRaw("email ILIKE ?", [`%${busca}%`])
      .orWhereRaw("nome_cliente ILIKE ?", [`%${busca}%`])
      .orWhereRaw("cpf::text ILIKE ?", [`%${sanitizeDigits(busca)}%`]);

    return res.status(200).json(buscaCliente);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  cadastrarCliente,
  pegarClientes,
  atualizarCliente,
  obterCliente,
  buscarCliente,
};