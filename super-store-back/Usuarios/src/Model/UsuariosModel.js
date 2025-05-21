const mysql = require("mysql2/promise");

// Configurar conexión a la base de datos
const connection = mysql.createPool({
    host: "mysql",
    user: "root",
    password: "password",
    database: "usuariosbd",
    port: 3306
});

// Crear un nuevo usuario
async function createUser(
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
) {
    const result = await connection.query(
        "INSERT INTO usuarios (iduser, username, fullname, email, password, address, country, city, postalcode, region) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            iduser,
            username,
            fullname,
            email,
            password,
            address,
            country,
            city,
            postalcode,
            region,
        ]
    );
    return result;
}

// Actualizar un usuario
async function updateUser(
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
) {
    const result = await connection.query(
        "UPDATE usuarios SET username = ?, fullname = ?, email = ?, password = ?, address = ?, country = ?, city = ?, postalcode = ?, region = ? WHERE iduser = ?",
        [
            username,
            fullname,
            email,
            password,
            address,
            country,
            city,
            postalcode,
            region,
            iduser,
        ]
    );
    return result;
}

// Eliminar un usuario
async function deleteUser(iduser) {
    const result = await connection.query(
        "DELETE FROM usuarios WHERE iduser = ?",
        [iduser]
    );
    return result;
}

// Obtener todos los usuarios
async function getAllUsers() {
    const [rows] = await connection.query("SELECT * FROM usuarios");
    return rows;
}

// Obtener un usuario por ID
async function getUserById(iduser) {
    const [rows] = await connection.query(
        "SELECT * FROM usuarios WHERE iduser = ?",
        [iduser]
    );
    return rows[0];
}

// Validar usuario por email
async function validateUserByEmail(email) {
    const [rows] = await connection.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
    );
    return rows[0];
}

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById,
    validateUserByEmail,
};
