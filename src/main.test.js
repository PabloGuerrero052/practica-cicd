const request = require("supertest");
const { app, suma, multiplica } = require("./main");

describe("Funciones aritmeticas", () => {
  test("suma correcta", () => {
    expect(suma(3, 2)).toBe(5);
  });

  test("suma de negativos", () => {
    expect(suma(-1, -1)).toBe(-2);
  });

  test("multiplica correcta", () => {
    expect(multiplica(3, 4)).toBe(12);
  });

  test("multiplica por cero", () => {
    expect(multiplica(5, 0)).toBe(0);
  });
});

describe("Rutas HTTP", () => {
  test("ruta raiz responde 200 con el nombre", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Pablo Guerrero");
  });

  test("ruta /salud devuelve estado ok", async () => {
    const res = await request(app).get("/salud");
    expect(res.statusCode).toBe(200);
    expect(res.body.estado).toBe("ok");
  });

  test("ruta /operacion calcula suma y multiplicacion", async () => {
    const res = await request(app).get("/operacion/3/2");
    expect(res.statusCode).toBe(200);
    expect(res.body.suma).toBe(5);
    expect(res.body.multiplicacion).toBe(6);
  });
});
