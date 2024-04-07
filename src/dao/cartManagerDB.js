import cartModel from "./models/cartModel";

class cartManagerDB {
  async getAllCarts() {
    try {
      return await cartModel.find();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al buscar products en el carrito");
    }
  }

  async getProductsFromCartByID(cid) {
    const cart = await cartModel.findOne({ _id: pid });

    if (!cart) throw new Error(`El carrito ${cid} no existe!`);

    return cart;
  }

  async createCart() {
    const carts = await this.getAllCarts();

    try {
      const result = await cartModel.create({
        id: this.getCartID(carts),
        products: [],
      });

      return result;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al crear el carrito");
    }
  }

  getCartID(carts) {
    const cartsLength = carts.length;
    if (cartsLength > 0) {
      return parseInt(carts[cartsLength - 1].id) + 1;
    }

    return 1;
  }

  async addProductByID(cid, pid) {
    //Check if exist product
    await this.productManagerFS.getProductByID(pid);

    const carts = await this.getAllCarts();
    let i = 0;
    const cartFilter = carts.filter((cart, index) => {
      if (cart.id == cid) i = index;
      return cart.id == cid;
    });
    console.log("index: ", i, "cid: ", cid);

    if (cartFilter.length > 0) {
      let exist = false;
      for (let key in carts[i].products) {
        if (carts[i].products[key].product == pid) {
          exist = true;
          carts[i].products[key].quantity++;
        }
      }

      if (!exist) {
        carts[i].products.push({
          product: pid,
          quantity: 1,
        });
      }
    } else {
      throw new Error(`El carrito ${cid} no existe!`);
    }

    try {
      await fs.promises.writeFile(this.file, JSON.stringify(carts, null, "\t"));

      return carts[i];
    } catch (e) {
      throw new Error("Error al actualizar el carrito");
    }
  }
}

export { cartManagerDB };
