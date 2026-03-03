const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

const knex = require("knex")({
  client: "pg",
  connection: {
    connectionString,
    ssl: { rejectUnauthorized: false },
  },
  pool: { min: 0, max: 10 },
});

module.exports = knex;
