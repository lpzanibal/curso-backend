const fs = require("fs");

class Contenedor {
  constructor(name) {
    this.name = name;
  }

  async save(item) {
    try {
      let items = await this.getAll();

      if (items.length > 0) {
        item.id =
          Math.max(
            ...items.map((element) => {
              return element.id;
            })
          ) + 1;
      } else item.id = 0;

      items.push(item);
      await fs.promises.writeFile(this.name, JSON.stringify(items));
      return item.id;
    } catch (error) {
      console.log("Error al guardar el producto");
      throw error;
    }
  }

  async getById(id) {
    try {
      let items = await this.getAll();
      let item = items.find((element) => element.id == id);
      return item ? item : null;
    } catch (error) {
      console.log("Error al obtener el producto");
      throw error;
    }
  }

  async getAll() {
    try {
      let files = await fs.promises.readdir("./");

      if (!files.includes(this.name))
        await fs.promises.writeFile(this.name, JSON.stringify([]));

      return JSON.parse(await fs.promises.readFile(this.name, "utf-8"));
    } catch (error) {
      console.log("Error al obtener los productos");
      throw error;
    }
  }

  async deleteById(id) {
    try {
      let items = await this.getAll();
      items = items.filter((element) => {
        return element.id != id;
      });
      await fs.promises.writeFile(this.name, JSON.stringify(items));
    } catch (error) {
      console.log("Error al eliminar el producto ID: " + id);
      throw error;
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(this.name, JSON.stringify([]));
    } catch (error) {
      console.log("Error al eliminar los productos");
      throw error;
    }
  }

  async update(item) {
    try {
      await this.deleteById(item.id);
      let items = await this.getAll();
      items.push(item);
      await fs.promises.writeFile(this.name, JSON.stringify(items));
    } catch (error) {
      console.log("Error al actualizar los registros");
      console.log(error);
    }
  }
}

module.exports = Contenedor;
