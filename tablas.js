const knex = require("knex");
const mysqlOptions = require("./src/options/mysql");
const sqlite3Options = require("./src/options/sqlite3");
console.log(sqlite3Options);
const mysql = knex(mysqlOptions);
const sqlite3 = knex(sqlite3Options);

const crearTablaProductos = () => {
  return mysql.schema.dropTableIfExists("productos").finally(() => {
    return mysql.schema.createTable("productos", (table) => {
      table.increments("id").primary();
      table.string("title", 255).notNullable();
      table.string("thumbnail", 1024).notNullable();
      table.float("price");
    });
  });
};

const crearTablaMensajes = () => {
  return sqlite3.schema.dropTableIfExists("mensajes").finally(() => {
    return sqlite3.schema.createTable("mensajes", (table) => {
      table.increments("id").primary();
      table.string("autor", 255).notNullable();
      table.string("texto", 2000).notNullable();
      table.date("fecha").notNullable();
    });
  });
};

(async function () {
  try {
    await crearTablaProductos();
    await crearTablaMensajes();
    mysql.destroy();
    sqlite3.destroy();
  } catch (error) {
    mysql.destroy();
    sqlite3.destroy();
    console.log(error);
  }
})();
