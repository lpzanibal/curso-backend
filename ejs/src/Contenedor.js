class Contenedor {
  constructor() {
    this.products = [];
  }

  save(product) {
    if (this.products.length > 0) {
      product.id =
        Math.max(
          ...this.products.map((element) => {
            return element.id;
          })
        ) + 1;
    } else product.id = 0;

    this.products.push(product);

    return product;
  }

  update(id, product) {
    let index = this.products.findIndex((product) => product.id == id);
    if (index !== -1) {
      this.products[index] = { id: id, ...product };
      return true;
    } else return false;
  }

  getById(id) {
    let product = this.products.find((product) => product.id == id);
    return product ? product : null;
  }

  getAll() {
    return this.products;
  }

  deleteById(id) {
    let previosLenght = this.products.length;
    let newProducts = this.products.filter((element) => {
      return element.id != id;
    });

    this.products = newProducts;

    return newProducts.length < previosLenght;
  }
}

module.exports = Contenedor;
