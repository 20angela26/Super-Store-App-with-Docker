const mysql = require("mysql2/promise");

// Configurar conexión a la base de datos
const connection = mysql.createPool({
    host: "mysql",
    user: "root",
    password: "password",
    database: "orderbd",
    port: 3306,
});

// Crear una nueva orden
async function crearOrden(orden) {
    const {
        iduser,
        itemsJson,
        discount,
        shipmode,
        totalprice,
        shipdate,
        orderdate,
    } = orden;
    const query = `
        INSERT INTO orders (iduser, items, discount, shipmode, totalprice, shipdate, orderdate) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.query(query, [
        iduser,
        itemsJson,
        discount || 0,
        shipmode,
        totalprice,
        shipdate,
        orderdate,
    ]);
    return result;
}

// Obtener una orden por ID
async function traerOrden(idorder) {
    try {
        const [result] = await connection.query(
            "SELECT * FROM orders WHERE idorder = ?",
            [idorder]
        );
        if (result.length > 0) {
            result[0].items = JSON.parse(result[0].items);
            return result[0];
        }
        return null;
    } catch (error) {
        console.error("Error al obtener orden:", error.message);
        throw error;
    }
}

// Obtener todas las órdenes
async function traerOrdenes() {
    try {
        const [result] = await connection.query("SELECT * FROM orders");
        return result.map((order) => ({
            ...order,
            items: JSON.parse(order.items),
        }));
    } catch (error) {
        console.error("Error al obtener órdenes:", error.message);
        throw error;
    }
}

module.exports = {
    crearOrden,
    traerOrden,
    traerOrdenes,
};
