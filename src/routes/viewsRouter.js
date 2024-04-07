import { Router } from "express";
import { productManagerDB } from "../dao/productManagerDB.js";
import MessageManagerDB from "../dao/messageManagerDB.js"; // Adjust import statement

const router = Router();
const productService = new productManagerDB();
const messageService = new MessageManagerDB();

router.get("/", async (req, res) => {
  res.render("index", {
    title: "Productos",
    style: "index.css",
    products: await productService.getAllProducts(),
  });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", {
    title: "Productos",
    style: "index.css",
    products: await productService.getAllProducts(),
  });
});

router.get("/messageService", async (req, res) => {
  try {
    const messages = await messageService.getAllMessages();
    res.render("messageService", { messages }); // Render the messageService view
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
