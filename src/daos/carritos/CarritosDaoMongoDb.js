const ContenedorMongoDb = require("../../persistencia/ContenedorMongoDb.js");

class CarritosDaoMongoDb extends ContenedorMongo {
  constructor() {
    super("carritos", {
      productos: { type: [], required: true },
    });
  }

  async guardar(carrito = { productos: [] }) {
    return super.guardar(carrito);
  }
}

export default CarritosDaoMongoDb;
