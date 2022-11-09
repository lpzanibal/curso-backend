const path = require("path");
const express = require("express");
const { Router } = express;
const Contenedor = require("./Contenedor");

const PORT = 8080;
const app = express();
const routerProductos = Router();
const productos = new Contenedor();

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/productos", routerProductos);

app.get("/", (req, res) => {
  res.render("carga");
});

app.get("/productos", (req, res) => {
  const listado = productos.getAll();
  res.render("listado", { productos: listado, noVacio: listado.length > 0 });
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
  productos.save(req.body);
  res.redirect("/productos");
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
