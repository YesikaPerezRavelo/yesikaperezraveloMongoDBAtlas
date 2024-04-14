import { Router } from "express";
//import { productManagerFS } from "../dao/productManagerFS.js";
//import { cartManagerFS } from "../dao/cartManagerFS.js";

import cartManagerDB from "../dao/cartManagerDB.js";

const router = Router();
//const ProductService = new productManagerFS("products.json");

//const CartService = new cartManagerFS("carts.json", ProductService);
const CartService = new cartManagerDB();

router.get("/:cid", async (req, res) => {
  try {
    const result = await CartService.getProductsFromCartByID(req.params.cid);
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await CartService.createCart();
    res.send({
      status: "success",
      message: "Your cart has been successfully been created",
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await CartService.getAllCarts();
    res.send({ carts });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    await CartService.addProductByID(cartId, productId, quantity);
    res.send({ status: "success", message: "producto agregado al carrito" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ status: "error", error: "ha ocurrido un error" });
  }
});

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const products = req.body.products;
  try {
    const cart = await CartService.updateCart(cartId, products);
    res.send({ status: "success", message: "Your cart has been edited", cart });
  } catch (error) {
    console.error(error);
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;
  try {
    await CartService.updateProductQuantity(cartId, productId, quantity);
    res.send({ status: "success", message: "quantity changed", cart });
  } catch (error) {
    console.error(error);
  }
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    await CartService.deleteAllProductsFromCart(cartId);
    res.send("Cart has been deleted");
  } catch (error) {
    return res
      .status(400)
      .send({ status: "error", error: "there is an error" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    await CartService.deleteProductFromCart(cartId, productId);
    res.send("Product " + productId + " has been deleted");
  } catch (error) {
    console.error(error);
  }
});

export default router;
