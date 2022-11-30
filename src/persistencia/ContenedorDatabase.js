const knex = require("knex");

class ContenedorDatabase {
  constructor(options, table) {
    this.knex = knex(options);
    this.table = table;
  }

  save(item) {
    return this.knex(this.table).insert(item, ['id']);
  }

  getAll() {
    return this.knex(this.table).select("*");
  }

  update(id, item) {
    return this.knex.from(this.table).where("id", id).update(item);
  }

  getById(id) {
    return this.knex(this.table).first("*").where("id", id);
  }

  deleteById(id) {
    return this.knex.from(this.table).where("id", id).del();
  }

  close() {
    this.knex.destroy();
  }
}

module.exports = ContenedorDatabase;