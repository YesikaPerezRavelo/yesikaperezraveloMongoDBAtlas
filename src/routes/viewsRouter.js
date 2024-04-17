import { Router } from "express";
import { productManagerDB } from "../dao/productManagerDB.js";
import messageManagerDB from "../dao/messageManagerDB.js"; // Adjust import statement
import cartManagerDB from "../dao/cartManagerDB.js";

const router = Router();
const productService = new productManagerDB();
const cartService = new cartManagerDB();

router.get("/", async (req, res) => {
  let { limit = 5, page = 1 } = req.query;

  res.render("index", {
    title: "Productos",
    style: "index.css",
    products: await productService.getAllProducts(limit, page),
  });
});

// router.get("/", async (req, res) => {
//   try {
//     let { limit = 5, page = 1 } = req.query;
//     const products = await productService.getAllProducts(limit, page);
//     const nextPage = products.hasNextPage
//       ? `/products?page=${products.nextPage}`
//       : null;
//     const prevPage = products.hasPrevPage
//       ? `/products?page=${products.prevPage}`
//       : null;

//     console.log('TEST => ', nextPage, prevPage)

//     res.render("index", {
//       title: "Productos",
//       style: "index.css",
//       products: products.docs,
//       nextPage: nextPage,
//       prevPage: prevPage,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

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
      title: "Chat",
      style: "index.css",
      messages: messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartService.getProductsFromCartByID(cartId);
    res.render("cart", {
      title: "Cart",
      style: "index.css",
      products: cart.products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
