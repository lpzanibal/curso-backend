const path = require("path");
const express = require("express");
const { Router } = express;
const Contenedor = require("./persistencia/Contenedor");
const esAdmin = require("./middleware/esAdmin");

const PORT = process.env.PORT || 8080;
const app = express();
const routerProductos = Router();
const routerCarrito = Router();

const productos = new Contenedor("productos.txt");
const carritos = new Contenedor("carritos.txt");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

//RUTAS PRODUCTOS
routerProductos.get("/", async (req, res) => {
  res.json(await productos.getAll());
});

routerProductos.get("/:id", async (req, res) => {
  let producto = await productos.getById(req.params.id);

  if (producto) res.json(producto);
  else res.json({ error: "Producto no encontrado" }).status(404);
});

routerProductos.post("/", esAdmin, async (req, res) => {
  const id = await productos.save({ ...req.body, timestamp: Date.now() });
  res.json(id);
});

routerProductos.put("/:id", esAdmin, async (req, res) => {
  await productos.update({ id: parseInt(req.params.id), ...req.body });
  res.json();
});

routerProductos.delete("/:id", esAdmin, async (req, res) => {
  await productos.deleteById(parseInt(req.params.id));
  res.json();
});

//RUTAS CARRITO
routerCarrito.post("/", async (req, res) => {
  const id = await carritos.save({ timestamp: Date.now(), productos: [] });
  res.json(id);
});

routerCarrito.delete("/:id", async (req, res) => {
  let exito = await carritos.deleteById(req.params.id);
  if (exito) res.json();
  else res.json({ error: "Carrito no encontrado" }).status(404);
});

routerCarrito.get("/:id/productos", async (req, res) => {
  let carrito = await carritos.getById(req.params.id);

  if (carrito) res.json(carrito.productos);
  else res.json({ error: "Carrito no encontrado" }).status(404);
});

routerCarrito.post("/:id/productos", async (req, res) => {
  let carrito = await carritos.getById(req.params.id);
  let nuevosProductos = [];

  req.body.productos.forEach(async (id) => {
    let producto = await productos.getById(id);
    nuevosProductos.push(producto);
  });

  carrito.productos = [...carrito.productos, ...nuevosProductos];
  await carritos.update(carrito);

  res.send();
});

routerCarrito.delete("/:id/productos/:idPorducto", async (req, res) => {
  let carrito = await carritos.getById(req.params.id);
  let nuevosProductos = carrito.productos.filter(
    (producto) => producto.id !== req.params.idPorducto
  );

  carrito.productos = nuevosProductos;

  await carritos.update(carrito);

  res.send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//Un producto dispondrá de los siguientes campos: id, timestamp, nombre, descripcion, código,
//foto (url), precio, stock.

/*
El carrito de compras tendrá la siguiente estructura:
id, timestamp(carrito), productos: { id, timestamp(producto), nombre, descripcion, código,
foto (url), precio, stock }
*/
