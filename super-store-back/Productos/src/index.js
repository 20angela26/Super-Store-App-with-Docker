const express = require("express");
const ProductosController = require("./Controller/ProductosController");
const morgan = require("morgan");
const cors = require("cors");

// Crear la aplicación de Express
const app = express();

// Configurar middlewares
app.use(morgan("dev")); // Mostrar logs de las solicitudes
app.use(express.json()); // Parsear cuerpos JSON

// Habilitar CORS para permitir solicitudes desde tu frontend y la I
app.use(cors({
    origin: "http://192.168.100.2:8080", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"] 
}));

// Registrar rutas del controlador
app.use(ProductosController);

// Iniciar el servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Microservicio de productos ejecutándose en el puerto ${PORT}`);
});

