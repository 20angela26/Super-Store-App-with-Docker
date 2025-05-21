const express = require("express");
const router = express.Router();
const axios = require("axios");
const orderModel = require("../models/OrdenesModel");

// Combinar ítems del carrito eliminando duplicados
function mergeCartItems(items) {
    const mergedItemsMap = new Map();
    items.forEach((item) => {
        const key = Number(item.idproduct);
        const existingItem = mergedItemsMap.get(key);
        if (existingItem) {
            existingItem.quantity += item.quantity;
            existingItem.totalprice =
                item.price * existingItem.quantity * (1 - item.discount / 100);
        } else {
            mergedItemsMap.set(key, {
                idproduct: Number(item.idproduct),
                productname: item.productname,
                price: item.price,
                discount: item.discount,
                quantity: item.quantity,
                totalprice:
                    item.price * item.quantity * (1 - item.discount / 100),
            });
        }
    });
    return Array.from(mergedItemsMap.values());
}

// Crear una nueva orden
router.post("/orders", async (req, res) => {
    const { iduser, discount = 0, shipmode, shipdate } = req.body;

    try {
        if (!iduser || !shipmode) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        // Obtener el carrito del usuario
        const cartResponse = await axios.get(
            `http://carrito:3308/cart/${iduser}`
        );
        const cart = cartResponse.data;
        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ error: "El carrito está vacío" });
        }

        const mergedItems = mergeCartItems(cart.items);
        const totalprice = mergedItems.reduce(
            (total, item) => total + item.totalprice,
            0
        );

        const orderdate = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        const ordenData = {
            iduser,
            itemsJson: JSON.stringify(mergedItems),
            discount,
            shipmode,
            totalprice,
            shipdate: shipdate || null,
            orderdate,
        };

        // Crear la orden en la base de datos
        const dbResult = await orderModel.crearOrden(ordenData);

        // Reducir el stock de los productos
        for (const item of mergedItems) {
            const { idproduct, quantity } = item;
            await axios.put(
                `http://productos:3001/productos/reduce-stock/${idproduct}`,
                { quantity }
            );
        }

        // Vaciar el carrito
        await axios.delete(`http://carrito:3308/cart/${iduser}`);

        const responseOrden = {
            idorder: dbResult.insertId,
            ...ordenData,
            items: mergedItems,
            shipdate: ordenData.shipdate,
            orderdate: ordenData.orderdate,
        };
        delete responseOrden.itemsJson;

        res.status(201).json({ message: "Orden creada", orden: responseOrden });
    } catch (error) {
        console.error("Error al crear orden:", error.message);
        const status = error.response?.status || 500;
        const message =
            error.response?.data?.error ||
            error.message ||
            "No se pudo procesar la orden";
        res.status(status).json({ error: message });
    }
});

// Obtener una orden por ID
router.get("/orders/:idorder", async (req, res) => {
    try {
        const orden = await orderModel.traerOrden(req.params.idorder);
        if (!orden) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }
        res.json(orden);
    } catch (error) {
        console.error("Error al obtener orden:", error.message);
        res.status(500).json({ error: "No se pudo obtener la orden" });
    }
});

// Obtener todas las órdenes
router.get("/orders", async (req, res) => {
    try {
        const ordenes = await orderModel.traerOrdenes();
        res.json(ordenes);
    } catch (error) {
        console.error("Error al obtener órdenes:", error.message);
        res.status(500).json({ error: "No se pudo obtener las órdenes" });
    }
});

module.exports = router;
