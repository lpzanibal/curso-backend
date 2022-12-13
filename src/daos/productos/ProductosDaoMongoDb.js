const ContenedorMongoDb = require("../../persistencia/ContenedorMongoDb.js");

class ProductosDaoMongoDb extends ContenedorMongo {
  constructor() {
    super("productos", {
      title: { type: String, required: true },
      price: { type: Number, required: true },
      thumbnail: { type: String, required: true },
    });
  }
}

export default ProductosDaoMongoDb;
