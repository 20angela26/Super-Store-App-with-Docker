const express = require("express");
const usuariosRoutes = require("./Controller/UsuariosController");
const morgan = require("morgan");
const cors = require("cors");

// Crear la aplicación de Express
const app = express();

// Configurar middlewares
app.use(morgan("dev")); // Mostrar logs de las solicitudes
app.use(express.json()); // Parsear cuerpos JSON

// Habilitar CORS de forma específica
app.use(cors({
    origin: "http://192.168.100.2:8080", // IP y puerto de tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

// Registrar rutas del controlador
app.use(usuariosRoutes);

// Iniciar el servidor
app.listen(3009, () => {
    console.log("Microservicio de usuarios ejecutándose en el puerto 3009");
});

