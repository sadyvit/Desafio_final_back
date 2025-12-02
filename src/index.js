require("dotenv").config();

const express = require("express");
const cors = require("cors");

const rotas = require("./rotas");
const app = express();

app.use(express.json());
app.use(cors());
app.use(rotas);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .json({ erro: "JSON inválido no corpo da requisição." });
  }
  next();
});

app.listen(process.env.PORT || 3333);
