import { Router } from "express";
//import { productManagerFS } from '../dao/productManagerFS.js';
import { productManagerDB } from "../dao/productManagerDB.js";

const router = Router();
//const ProductService = new productManagerFS('products.json');
const ProductService = new productManagerDB();

router.get("/", async (req, res) => {
  res.render("index", {
    title: "Productos",
    style: "index.css",
    products: await ProductService.getAllProducts(),
  });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    title: "Productos",
    style: "index.css",
    products: await ProductService.getAllProducts(),
  });
});

export default router;
