const fs = require("fs");

class ContenedorFilesystem {
  constructor(name) {
    this.name = name;
  }

  async save(item) {
    try {
      let items = await this.getAll();
      items.push(item);
      await fs.promises.writeFile(this.name, JSON.stringify(items));
    } catch (error) {
      console.log("Error al guardar registro");
      console.log(error);
    }
  }

  async getAll() {
    try {
      let files = await fs.promises.readdir("./");

      if (!files.includes(this.name))
        await fs.promises.writeFile(this.name, JSON.stringify([]));

      return JSON.parse(await fs.promises.readFile(this.name, "utf-8"));
    } catch (error) {
      console.log("Error al obtener los registros");
      console.log(error);
    }
  }
}

module.exports = ContenedorFilesystem;
