import { Router } from "express";
import { productManagerDB } from "../dao/productManagerDB.js";
import messageManagerDB from "../dao/messageManagerDB.js"; // Adjust import statement

const router = Router();
const productService = new productManagerDB();

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

router.get("/chat", async (req, res) => {
  try {
    const messages = await messageManagerDB.getAllMessages();
    res.render("messageService", {
      title: "Chat", // Set the title to "Chat"
      style: "index.css", // Link to the index.css stylesheet
      messages: messages, // Provide messages to the view
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
