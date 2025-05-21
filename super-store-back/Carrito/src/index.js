const express = require("express");
const carritoController = require("./controllers/carritoController");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(cors({
	origin: "http://192.168.100.2:8080",
	methods: ["GET", "POST", "PUT", "DELETE"],     
	allowedHeaders: ["Content-Type"]
}));

app.use(carritoController);

app.listen(3308, () => {
	console.log("microservicio de carrito escuchando en el puerto 3308");});

