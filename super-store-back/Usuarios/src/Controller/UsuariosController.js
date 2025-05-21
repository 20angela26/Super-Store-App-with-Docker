const { Router } = require("express");
const router = Router();
const usuariosModel = require("../Model/UsuariosModel");

// Crear un nuevo usuario
router.post("/usuarios", async (req, res) => {
    try {
        const {
            username,
            fullname,
            email,
            password,
            address,
            country,
            city,
            postalcode,
            region,
        } = req.body;
        if (
            !username ||
            !fullname ||
            !email ||
            !password ||
            !address ||
            !country ||
            !city ||
            !postalcode ||
            !region
        ) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const existingUser = await usuariosModel.validateUserByEmail(email);
        if (existingUser) {
            return res
                .status(409)
                .json({ error: "El email ya está registrado" });
        }

        await usuariosModel.createUser(
            null,
            username,
            fullname,
            email,
            password,
            address,
            country,
            city,
            postalcode,
            region
        );
        res.status(201).json({ message: "Usuario creado" });
    } catch (error) {
        console.error("Error al crear usuario:", error.message);
        res.status(500).json({ error: "No se pudo crear el usuario" });
    }
});

// Actualizar un usuario
router.put("/usuarios/:iduser", async (req, res) => {
    try {
        const { iduser } = req.params;
        const {
            username,
            fullname,
            email,
            password,
            address,
            country,
            city,
            postalcode,
            region,
        } = req.body;

        if (
            !username ||
            !fullname ||
            !email ||
            !password ||
            !address ||
            !country ||
            !city ||
            !postalcode ||
            !region
        ) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const result = await usuariosModel.updateUser(
            iduser,
            username,
            fullname,
            email,
            password,
            address,
            country,
            city,
            postalcode,
            region
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario actualizado" });
    } catch (error) {
        console.error("Error al actualizar usuario:", error.message);
        res.status(500).json({ error: "No se pudo actualizar el usuario" });
    }
});

// Eliminar un usuario
router.delete("/usuarios/:iduser", async (req, res) => {
    try {
        const { iduser } = req.params;
        const result = await usuariosModel.deleteUser(iduser);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario eliminado" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error.message);
        res.status(500).json({ error: "No se pudo eliminar el usuario" });
    }
});

// Obtener todos los usuarios
router.get("/usuarios", async (req, res) => {
    try {
        const users = await usuariosModel.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error.message);
        res.status(500).json({ error: "No se pudo obtener los usuarios" });
    }
});

// Obtener un usuario por ID
router.get("/usuarios/:iduser", async (req, res) => {
    try {
        const user = await usuariosModel.getUserById(req.params.iduser);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error al obtener usuario:", error.message);
        res.status(500).json({ error: "No se pudo obtener el usuario" });
    }
});

// Validar si un email ya existe
router.post("/usuarios/validar", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Se requiere email" });
        }
        const validUser = await usuariosModel.validateUserByEmail(email);
        res.json({ valid: !!validUser });
    } catch (error) {
        console.error("Error al validar usuario:", error.message);
        res.status(500).json({ error: "No se pudo validar el usuario" });
    }
});

// Iniciar sesión con email y contraseña
router.post("/usuarios/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Se requieren email y contraseña" });
        }

        const user = await usuariosModel.validateUserByEmail(email);
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        res.json({
            message: "Login exitoso",
            user: {
                iduser: user.iduser,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        res.status(500).json({ error: "No se pudo validar el login" });
    }
});

module.exports = router;
