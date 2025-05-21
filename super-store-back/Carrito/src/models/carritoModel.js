const mysql = require("mysql2/promise");
const axios = require("axios");

// Configurar conexión a la base de datos
const connection = mysql.createPool({
    host: "mysql",
    user: "root",
    password: "password",
    database: "carritobd",
    port: 3306,
});

// Agregar productos al carrito de un usuario
async function agregarAlCarrito(iduser, newItemsJson) {
    try {
        const [result] = await connection.query(
            "SELECT * FROM cart WHERE iduser = ?",
            [iduser]
        );
        let updatedItems = [];
        if (result.length > 0) {
            // Si el carrito existe, combinar los ítems actuales con los nuevos
            const currentItems = JSON.parse(result[0].items || "[]");
            const newItems = JSON.parse(newItemsJson || "[]").map((item) => ({
                ...item,
                idproduct: Number(item.idproduct),
            }));
            updatedItems = await combinarProductos(currentItems, newItems);
        } else {
            // Si no hay carrito, crear uno nuevo con los ítems
            updatedItems = JSON.parse(newItemsJson || "[]").map((item) => ({
                ...item,
                idproduct: Number(item.idproduct),
                price: Number(item.price),
                discount: Number(item.discount),
                totalprice: calcularTotalProducto(item),
            }));
        }

        // Verificar que los ítems sean un arreglo válido
        if (!Array.isArray(updatedItems)) {
            throw new Error("Los ítems actualizados no son un arreglo válido");
        }

        const totalprice = calcularTotal(updatedItems);
        // Guardar o actualizar el carrito en la base de datos
        await connection.query(
            `INSERT INTO cart (iduser, items, totalprice)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE items = VALUES(items), totalprice = VALUES(totalprice)`,
            [iduser, JSON.stringify(updatedItems), totalprice]
        );
    } catch (error) {
        console.error("Error al agregar al carrito:", error.message);
        throw new Error("No se pudo agregar productos al carrito");
    }
}

// Combinar ítems existentes con nuevos, respetando el stock
async function combinarProductos(existingItems, newItems) {
    try {
        const itemsMap = new Map();

        // Normalizar ítems existentes
        existingItems = Array.isArray(existingItems) ? existingItems : [];
        existingItems.forEach((item) => {
            const id = Number(item.idproduct);
            itemsMap.set(id, {
                ...item,
                idproduct: id,
                price: Number(item.price),
                discount: Number(item.discount),
            });
        });

        // Procesar nuevos ítems y verificar stock
        newItems = Array.isArray(newItems) ? newItems : [];
        for (const item of newItems) {
            const id = Number(item.idproduct);
            const productResponse = await axios.get(
                `http://productos:3001/productos/${id}`
            );
            const { stock, productname } = productResponse.data;

            let totalQuantity = item.quantity;
            if (itemsMap.has(id)) totalQuantity += itemsMap.get(id).quantity;

            if (totalQuantity > stock) {
                throw new Error(
                    `Stock insuficiente para ${productname}. Disponible: ${stock}, solicitado: ${totalQuantity}`
                );
            }

            if (itemsMap.has(id)) {
                const existingItem = itemsMap.get(id);
                existingItem.quantity = totalQuantity;
                existingItem.totalprice = calcularTotalProducto(existingItem);
            } else {
                itemsMap.set(id, {
                    ...item,
                    idproduct: id,
                    price: Number(item.price),
                    discount: Number(item.discount),
                    totalprice: calcularTotalProducto(item),
                });
            }
        }

        return Array.from(itemsMap.values());
    } catch (error) {
        console.error("Error al combinar productos:", error.message);
        throw error;
    }
}

// Calcular el precio total de un producto con descuento
function calcularTotalProducto(item) {
    return (
        Number(item.price) *
        item.quantity *
        ((100 - Number(item.discount)) / 100)
    );
}

// Calcular el precio total del carrito
function calcularTotal(items) {
    return items.reduce(
        (total, item) => total + (Number(item.totalprice) || 0),
        0
    );
}

// Obtener el carrito de un usuario
async function traerCarrito(iduser) {
    try {
        const [result] = await connection.query(
            "SELECT * FROM cart WHERE iduser = ?",
            [iduser]
        );
        if (result.length > 0) {
            return { ...result[0], items: JSON.parse(result[0].items || "[]") };
        }
        return null;
    } catch (error) {
        console.error("Error al obtener carrito:", error.message);
        throw new Error("No se pudo obtener el carrito");
    }
}

// Vaciar el carrito de un usuario
async function vaciarCarrito(iduser) {
    try {
        await connection.query("DELETE FROM cart WHERE iduser = ?", [iduser]);
        return true;
    } catch (error) {
        console.error("Error al vaciar carrito:", error.message);
        throw new Error("No se pudo vaciar el carrito");
    }
}

// Obtener todos los carritos
async function getAllCarts() {
    try {
        const [rows] = await connection.query("SELECT * FROM cart");
        return rows.map((cart) => ({
            ...cart,
            items: JSON.parse(cart.items || "[]"),
        }));
    } catch (error) {
        console.error("Error al obtener carritos:", error.message);
        throw error;
    }
}

// Eliminar un producto del carrito
async function eliminarProductoDelCarrito(idcart, idproduct) {
    try {
        const [rows] = await connection.query(
            "SELECT items FROM cart WHERE idcart = ?",
            [idcart]
        );
        if (rows.length === 0) return { error: "Carrito no encontrado" };

        let items = JSON.parse(rows[0].items || "[]");
        const nuevoItems = items.filter(
            (item) => Number(item.idproduct) !== Number(idproduct)
        );

        if (nuevoItems.length === items.length) {
            return { error: "Producto no encontrado en el carrito" };
        }

        if (nuevoItems.length === 0) {
            await connection.query("DELETE FROM cart WHERE idcart = ?", [
                idcart,
            ]);
            return { message: "Carrito eliminado" };
        }

        const totalprice = calcularTotal(nuevoItems);
        await connection.query(
            "UPDATE cart SET items = ?, totalprice = ? WHERE idcart = ?",
            [JSON.stringify(nuevoItems), totalprice, idcart]
        );
        return { message: "Producto eliminado del carrito" };
    } catch (error) {
        console.error("Error al eliminar producto:", error.message);
        throw new Error("No se pudo eliminar el producto");
    }
}

// Modificar la cantidad de un producto en el carrito
async function modificarCantidadProducto(idcart, idproduct, quantity) {
    try {
        if (!Number.isInteger(quantity) || quantity < 0) {
            return {
                error: "La cantidad debe ser un número entero no negativo",
            };
        }
        const [rows] = await connection.query(
            "SELECT items FROM cart WHERE idcart = ?",
            [idcart]
        );
        if (rows.length === 0) return { error: "Carrito no encontrado" };

        let items = JSON.parse(rows[0].items || "[]");
        const itemIndex = items.findIndex(
            (item) => Number(item.idproduct) === Number(idproduct)
        );
        if (itemIndex === -1)
            return { error: "Producto no encontrado en el carrito" };

        if (quantity === 0) {
            items = items.filter(
                (item) => Number(item.idproduct) !== Number(idproduct)
            );
        } else {
            items[itemIndex].quantity = quantity;
            items[itemIndex].totalprice = calcularTotalProducto(
                items[itemIndex]
            );
        }

        if (items.length === 0) {
            await connection.query("DELETE FROM cart WHERE idcart = ?", [
                idcart,
            ]);
            return { message: "Carrito eliminado", updatedItem: null };
        }

        const totalprice = calcularTotal(items);
        await connection.query(
            "UPDATE cart SET items = ?, totalprice = ? WHERE idcart = ?",
            [JSON.stringify(items), totalprice, idcart]
        );
        return {
            message: "Cantidad actualizada",
            updatedItem: items[itemIndex],
        };
    } catch (error) {
        console.error("Error al modificar cantidad:", error.message);
        throw new Error("No se pudo modificar la cantidad");
    }
}

module.exports = {
    agregarAlCarrito,
    traerCarrito,
    vaciarCarrito,
    getAllCarts,
    eliminarProductoDelCarrito,
    modificarCantidadProducto,
};
