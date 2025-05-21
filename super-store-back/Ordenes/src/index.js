const express = require("express");
const morgan = require("morgan");
const ordenesController = require("./controllers/OrdenesController");
const cors = require("cors");

// Crear la aplicación de Express
const app = express();

// Configurar middlewares
app.use(morgan("dev")); // Mostrar logs de las solicitudes
app.use(express.json()); // Parsear cuerpos JSON

// Habilitar CORS para permitir solicitudes desde tu frontend
app.use(cors({
    origin: "http://192.168.100.2:8080", // IP y puerto del frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

// Registrar rutas del controlador
app.use(ordenesController);

// Iniciar el servidor
app.listen(3010, () => {
    console.log("Microservicio de órdenes escuchando en el puerto 3010");
});

