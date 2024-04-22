import { Router } from "express";
import { productManagerDB } from "../dao/productManagerDB.js";
import messageManagerDB from "../dao/messageManagerDB.js"; // Adjust import statement
import cartManagerDB from "../dao/cartManagerDB.js";
import { auth } from "../middlewares/auth.js";

const router = Router();
const productService = new productManagerDB();
const cartService = new cartManagerDB();

router.get("/login", async (req, res) => {
  if (req.session.user) {
    res.redirect("/user");
  } else {
    res.render("login", {
      title: "YesFitness | Login",
      script: "user.js",
      style: "index.css",
      failLogin: req.session.failLogin ?? false,
    });
  }
});

router.get("/register", async (req, res) => {
  if (req.session.user) {
    res.redirect("/user");
  }
  res.render("register", {
    title: "YesFitness | Register",
  });
});

router.get("/user", auth, async (req, res) => {
  const userId = req.session.user._id;
  const cart = await cartModel.findOne({ user: userId }).lean();
  res.render("user", {
    title: "YesFitness | Usuario",
    user: req.session.user,
    cart: cart,
  });
});

router.get("/", async (req, res) => {
  let { limit = 5, page = 1 } = req.query;

  res.render("index", {
    title: "Productos",
    style: "index.css",
    products: await productService.getAllProducts(limit, page),
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
      title: "YesFitness Cart",
      style: "index.css",
      cartId: cartId,
      products: cart.products,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
