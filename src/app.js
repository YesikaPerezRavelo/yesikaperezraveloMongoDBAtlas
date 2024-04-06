import express from "express";
import handlebars from "express-handlebars";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import viewsRouter from "./routes/viewsRouter.js";
import __dirname from "./utils/constantsUtil.js";
import { Server } from "socket.io";
import websocket from "./websocket.js";
import mongoose from "mongoose";

const app = express();

const conexion = async () => {
  try {
    //await mongoose.connect("mongodb://127.0.0.1:27017", { dbName: "usuarios" });
    await mongoose.connect(
      "mongodb+srv://yesika:12345hola@cluster0.mgxmvbv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      { dbName: "products" }
    );
    console.log("conetando a la bd local primera y la otra es remota");
  } catch (error) {
    console.log("fallo conexion");
  }
};

conexion();

//Handlebars Config
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/../views");
app.set("view engine", "handlebars");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/products", viewsRouter);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Start server in PORT ${PORT}`);
});

const io = new Server(httpServer);

websocket(io);
