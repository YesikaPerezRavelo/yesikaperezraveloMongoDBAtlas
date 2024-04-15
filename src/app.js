import express from "express";
import handlebars from "express-handlebars";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import { Server } from "socket.io";
import __dirname from "./utils/constantsUtil.js";
import websocket from "./websocket.js";
import mongoose from "mongoose";

const app = express();

const conexion = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yesika:12345hola@cluster0.mgxmvbv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      { dbName: "products" }
    );
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
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
        padding: 20px;
        font-family: "Montserrat", sans-serif;
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
      .button {
        background-color: #d78383;
        color: #fff;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        margin-top: 10px;
        font-family: "Montserrat", sans-serif;
      }
      .button:hover {
        background-color: rgb(10, 3, 3);
        color: white;
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
      <p>Are you searching for a class or do you want to post your class online?</p>
      <div>
        <button class="button" onclick="window.location.href='/products'">List of classes</button>
        <button class="button" onclick="window.location.href='/products/realtimeproducts'">Coach post your class</button>
        <button class="button" onclick="window.location.href='/products/chat'">Send us a message</button>
        <button class="button" onclick="window.location.href='/products/661c5c913dd9a9b96a0ca207'">View Cart</button>
      </div>
    </div>
    
  </body>
  </html>
  
  `);
});

// Routers
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
