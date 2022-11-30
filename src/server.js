const path = require("path");
const express = require("express");
const { Router } = express;
const mysqlOptions = require("./options/mysql");
const sqlite3Options = require("./options/sqlite3");
const ContenedorDatabase = require("./persistencia/ContenedorDatabase");
const handlebars = require("express-handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const PORT = 8080;
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const routerProductos = Router();
const productos = new ContenedorDatabase(mysqlOptions, "productos");
const mensajes = new ContenedorDatabase(sqlite3Options, "mensajes");

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/productos", routerProductos);

app.get("/", (req, res) => {
  res.render("carga");
});

app.get("/productos", async (req, res) => {
  productos.getAll().then((rows) => {
    res.render("listado", { productos: rows, noVacio: rows.length > 0 });
  });
});

routerProductos.get("/", (req, res) => {
  productos
    .getAll()
    .then((rows) => {
      return res.json(rows);
    })
    .catch((e) => res.json({ error: "Error" }).status(500));
});

routerProductos.get("/:id", (req, res) => {
  productos
    .getById(req.params.id)
    .then((row) => {
      if (row) res.json(row);
      else res.json({ error: "Producto no encontrado" }).status(404);
    })
    .catch((e) => res.json({ error: "Error" }).status(500));
});

routerProductos.post("/", (req, res) => {
  productos
    .save(req.body)
    .then((row) => {
      productos.getAll().then((rows) => {
        io.emit("productos", rows);
      });
      res.send(row);
    })
    .catch((e) => res.json({ error: "Error" }).status(500));
});

routerProductos.put("/:id", (req, res) => {
  productos
    .update(req.params.id, req.body)
    .then((row) => {
      res.send();
    })
    .catch((e) => res.json({ error: "Error" }).status(500));
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
  productos.getAll().then((rows) => {
    socket.emit("productos", rows);
  });

  mensajes.getAll().then((rows) => {
    socket.emit("mensajes", rows);
  });

  socket.on("mensaje", async (mensaje) => {
    mensaje.fecha = new Date().toLocaleString();
    await mensajes.save(mensaje);
    const msjs = await mensajes.getAll();
    io.emit("mensajes", msjs);
  });
});
