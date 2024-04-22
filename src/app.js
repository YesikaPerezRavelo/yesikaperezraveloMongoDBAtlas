import express from "express";
import handlebars from "express-handlebars";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import { Server } from "socket.io";
import __dirname from "./utils/constantsUtil.js";
import websocket from "./websocket.js";
import mongoose from "mongoose";
import mongoStore from "connect-mongo";
import session from "express-session";
import usersRouter from "./routes/usersRouter.js";

const app = express();
const uri =
  "mongodb+srv://yesika:12345hola@cluster0.mgxmvbv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const conexion = async () => {
  try {
    await mongoose.connect(uri, { dbName: "products" });
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas:", error.message);
  }
};

conexion();

//Handlebars Config
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/../views");
app.set("view engine", "handlebars");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/js", express.static(__dirname + "/path/to/js"));

app.use(
  session({
    store: mongoStore.create({
      mongoUrl: uri,
      ttl: 20,
    }),
    secret: "secretPhrase",
    resave: true,
    saveUninitialized: true,
  })
);

//Hello
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
<html>
<head>
  <title>Bienvenido a nuestra tienda en línea</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Montserrat', sans-serif;
      background-color: #f0f0f0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
      background-color: #fff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333;
    }
    p {
      color: #666;
    }
    .input {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
    }
    .button {
      background-color: #d78383;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 3px;
      cursor: pointer;
      margin-top: 10px;
      font-family: 'Montserrat', sans-serif;
    }
    .button:hover {
      background-color: #a54242;
    }
    .modal {
      display: none;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.4);
    }
    .modal-content {
      background-color: #fefefe;
      margin: 10% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to our clases online</h1>
    <p>Sign up and post your class or find a class that suits you </p>
    <div>
      <!-- Login form -->
      <form class="box products-form" method="post" action="/api/sessions/login">
        <label for="email">Email</label>
        <input class="input" type="email" name="email" id="email" />
        <label for="password">Password</label>
        <input class="input" type="password" name="password" id="password" />
        <button class="button" type="submit">Login</button>
      </form>
      <span><a href="/js/register.js" target="_self">Register</a></span>
    </div>
  </div>
</body>
</html>

  `);
});

// Routers
app.use("/api/sessions", usersRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/products", viewsRouter);

// Start server
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.io integration
const io = new Server(httpServer);
websocket(io);
