//import { productManagerFS } from "./dao/productManagerFS.js";
//const ProductService = new productManagerFS('products.json');
import { productManagerDB } from "./dao/productManagerDB.js";
import userManagerDB from "./dao/userManagerDB.js";

const UserManager = new userManagerDB();
const ProductService = new productManagerDB();

export default (io) => {
  io.on("connection", (socket) => {
    socket.on("createProduct", async (data) => {
      try {
        console.log("DATA CREATE => ", data);
        await ProductService.createProduct(data);
        const products = await ProductService.getAllProducts();
        socket.emit("publishProducts", products.docs);
      } catch (error) {
        socket.emit("statusError", error.message);
      }
    });

    socket.on("deleteProduct", async (data) => {
      try {
        const result = await ProductService.deleteProduct(data.pid);
        socket.emit("publishProducts", result);
      } catch (error) {
        socket.emit("statusError", error.message);
      }
    });

    socket.on("message", async (data) => {
      console.log(`Message received from ${socket.id}: ${data.message}`);
      // Handle message logic here
      try {
        await messagemanagerdb.insertMessage(data.user, data.message);
        io.emit("messagesLogs", await messagemanagerdb.getAllMessages());
      } catch (error) {
        console.error("Error handling message:", error.message);
      }
    });

    socket.on("userConnect", async (data) => {
      try {
        socket.emit("messagesLogs", await messagemanagerdb.getAllMessages());
        socket.broadcast.emit("newUser", data);
      } catch (error) {
        console.error("Error handling user connection:", error.message);
      }
    });

    socket.on("registerUser", async (userData) => {
      try {
        await UserManager.registerUser(userData);
        socket.emit("registrationSuccess", "User registered successfully!");
      } catch (error) {
        socket.emit("registrationError", error.message);
      }
    });

    socket.on("loginUser", async (loginData) => {
      try {
        const user = await UserManager.authenticateUser(loginData);
        socket.emit("loginSuccess", user);
      } catch (error) {
        socket.emit("loginError", error.message);
      }
    });

    socket.on("logoutUser", async () => {
      try {
      } catch (error) {}
    });
  });
};
