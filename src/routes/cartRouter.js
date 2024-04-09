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
      payload: result,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const result = await CartService.addProductByID(
      req.params.cid,
      req.params.pid
    );
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

export default router;
