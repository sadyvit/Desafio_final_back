CREATE TABLE clientes (
    id serial primary key,
      nome_cliente varchar(80),
      email VARCHAR(100) NOT NULL UNIQUE,
      cpf bigint NOT NULL UNIQUE,
      telefone bigint NOT NULL,
      cep integer,
      logradouro varchar(30),
      complemento varchar(50),
      bairro varchar(20),
      cidade varchar(20),
      estado varchar(20)
);

CREATE TABLE usuarios (
    id serial primary key,
    nome_usuario varchar(80) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    cpf varchar(15)
);

CREATE TABLE cobranca (
    id SERIAL primary key,
      cliente_id INTEGER NOT NULL,
      descricao varchar(40) NOT NULL,
      status varchar(8) NOT NULL,
      valor numeric NOT NULL,
      vencimento timestamptz NOT NULL,
      FOREIGN KEY (cliente_id) REFERENCES clientes (id)
);