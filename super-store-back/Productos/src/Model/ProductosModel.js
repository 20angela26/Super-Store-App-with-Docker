const mysql = require("mysql2/promise");

// Configurar conexión a la base de datos
const connection = mysql.createPool({
    host: "mysql",
    user: "root",
    password: "password",
    database: "productosbd",
    port: 3306,
});

const ProductosModel = {
    // Crear un nuevo producto
    async create(product) {
        const {
            productname,
            category,
            subcategory,
            description,
            stock,
            price,
            discount,
        } = product;
        await connection.query(
            "INSERT INTO productos (productname, category, subcategory, description, stock, price, discount) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                productname,
                category,
                subcategory,
                description,
                stock,
                price,
                discount,
            ]
        );
    },

    // Actualizar el stock de un producto
    async updateStock(id, stock) {
        await connection.query(
            "UPDATE productos SET stock = ? WHERE idproduct = ?",
            [stock, id]
        );
    },

    // Actualizar el descuento de un producto
    async updateDiscount(id, discount) {
        await connection.query(
            "UPDATE productos SET discount = ? WHERE idproduct = ?",
            [discount, id]
        );
    },

    // Eliminar un producto
    async delete(id) {
        await connection.query("DELETE FROM productos WHERE idproduct = ?", [
            id,
        ]);
    },

    // Obtener todos los productos
    async getAll() {
        const [rows] = await connection.query("SELECT * FROM productos");
        return rows;
    },

    // Obtener un producto por ID
    async getById(id) {
        const [rows] = await connection.query(
            "SELECT * FROM productos WHERE idproduct = ?",
            [id]
        );
        return rows[0];
    },

    // Reducir el stock de un producto
    async reduceStock(id, quantity) {
        try {
            const [result] = await connection.query(
                `UPDATE productos SET stock = stock - ? WHERE idproduct = ? AND stock >= ?`,
                [quantity, id, quantity]
            );
            if (result.affectedRows === 0) {
                throw new Error(
                    `Stock insuficiente para el producto con ID ${id}`
                );
            }
            return result;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = ProductosModel;
