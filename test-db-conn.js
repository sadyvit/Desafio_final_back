require("dotenv").config();

// Test DB connection through existing knex config
const knex = require("./src/bancodedados/conexao");

(async () => {
  try {
    console.log("Using DATABASE_URL:", !!process.env.DATABASE_URL);
    const res = await knex.raw("select now()");
    console.log("✅ DB responded:", res.rows ? res.rows[0] : res);
    await knex.destroy();
    process.exit(0);
  } catch (err) {
    console.error("❌ DB connection error:", err.message || err);
    try {
      await knex.destroy();
    } catch (e) {}
    process.exit(1);
  }
})();
