const ContenedorFirebase = require("../../persistencia/ContenedorFirebase.js");

class ProductosDaoFirebase extends ContenedorFirebase {
  constructor() {
    super("productos");
  }
}

export default ProductosDaoFirebase;
