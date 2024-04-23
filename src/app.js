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
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet">
      <title>Welcome Home Page</title>
      <style>
          body, html {
              height: 100%;
              margin: 0;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              font-family: "Montserrat", sans-serif;
          }
          h1 {
              margin-top: 20px;
          }
          img {
              max-width: 100%;
              max-height: 70%;
              display: block;
              margin: auto;
          }
          .button {
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #d78383;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              text-decoration: none;
              margin-bottom: 2rem;
          }
      </style>
  </head>
  <body>
      <h1>Welcome Home Page</h1>
      <h3>Find or Teach your class</h3>
      <img src="https://firebasestorage.googleapis.com/v0/b/productyesfitness.appspot.com/o/portada.jpg?alt=media&token=6e794bcc-7486-4bef-8337-b4480b66383f" alt="Welcome Image">
      <a href="http://localhost:8080/login" class="button">Check it out</a>
  </body>
  </html>
  


  `);
});

// Routers
app.use("/api/session", usersRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

// Start server
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.io integration
const io = new Server(httpServer);
websocket(io);
