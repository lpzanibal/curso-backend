const path = require("path");
const express = require("express");
const { Router } = express;
const Contenedor = require("./Contenedor");
const Mensajes = require("./Mensajes");
const handlebars = require("express-handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const PORT = 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const routerProductos = Router();
const productos = new Contenedor();
const mensajes = new Mensajes("mensajes.txt");

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static(path.join(__dirname, "../public")));
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
  const id = productos.save(req.body);
  //res.json(id);
  io.emit("productos", productos.getAll());
  res.send();
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

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("Usuario conectado");
  socket.emit("productos", productos.getAll());

  (async function () {
    const msjs = await mensajes.getAll();
    socket.emit("mensajes", msjs);
  })();

  socket.on("mensaje", async (mensaje) => {
    mensaje.fecha = new Date().toLocaleString();
    await mensajes.save(mensaje);
    const msjs = await mensajes.getAll();
    io.emit("mensajes", msjs);
  });
});
