const path = require("path");
const express = require("express");
const { Router } = express;
const Contenedor = require("./Contenedor");

const PORT = 8080;
const app = express();
const routerProductos = Router();
const productos = new Contenedor();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/productos", routerProductos);

app.get("/", (req, res) => {
  res.send("index.html");
});

routerProductos.get("/", (req, res) => {
  res.json(productos.getAll());
});

routerProductos.get("/:id", (req, res) => {
  let producto = productos.getById(req.params.id);
  if (producto) res.json(producto);
  else res.json({ error: "Producto no encontrado" }).status(404);
});

routerProductos.post("/", (req, res) => {
  const id = productos.save(req.body);
  res.json(id);
});

routerProductos.put("/:id", (req, res) => {
  let exito = productos.update(req.params.id, req.body);
  if (exito) res.json();
  else res.json({ error: "Producto no encontrado" }).status(404);
});

routerProductos.delete("/:id", (req, res) => {
  let exito = productos.deleteById(req.params.id);
  if (exito) res.json();
  else res.json({ error: "Producto no encontrado" }).status(404);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

/*
GET '/api/productos' -> devuelve todos los productos.
● GET '/api/productos/:id' -> devuelve un producto según su id.
● POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id
asignado.
● PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
● DELETE '/api/productos/:id' -> elimina un producto según su id
*/
