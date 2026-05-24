const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

function suma(a, b) {
  return a + b;
}

function multiplica(a, b) {
  return a * b;
}

app.get("/", (req, res) => {
  const resultado = suma(3, 2);
  res.send(`Hola mundo. Pablo Guerrero. La suma de 3+2 es ${resultado}`);
});

app.get("/salud", (req, res) => {
  res.json({ estado: "ok", servicio: "practica-cicd" });
});

app.get("/operacion/:a/:b", (req, res) => {
  const a = parseInt(req.params.a, 10);
  const b = parseInt(req.params.b, 10);
  res.json({
    suma: suma(a, b),
    multiplicacion: multiplica(a, b),
  });
});

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
}

module.exports = { app, suma, multiplica };
