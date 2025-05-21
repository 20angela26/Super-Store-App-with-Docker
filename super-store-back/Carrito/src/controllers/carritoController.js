const express = require("express");
const router = express.Router();
const axios = require("axios");
const cartModel = require("../models/carritoModel");

// Obtener el carrito de un usuario
router.get("/cart/:iduser", async (req, res) => {
    try {
        const carrito = await cartModel.traerCarrito(req.params.iduser);
        if (!carrito) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.json(carrito);
    } catch (error) {
        console.error("Error al obtener carrito:", error.message);
        res.status(500).json({ error: "No se pudo obtener el carrito" });
    }
});

// Agregar productos al carrito
router.post("/cart", async (req, res) => {
    try {
        const { iduser, items } = req.body;
        if (!iduser || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Datos inválidos" });
        }

        // Verificar que el usuario existe
        const userResponse = await axios.get(
            `http://usuarios:3009/usuarios/${iduser}`
        );
        if (!userResponse.data) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Resolver ítems con datos del producto y validar stock
        const resolvedItems = await Promise.all(
            items.map(async (item) => {
                const { idproduct, quantity } = item;
                const productResponse = await axios.get(
                    `http://productos:3001/productos/${idproduct}`
                );
                if (!productResponse.data) {
                    throw new Error(
                        `Producto con ID ${idproduct} no encontrado`
                    );
                }
                const { productname, price, discount, stock } =
                    productResponse.data;

                if (quantity > stock) {
                    throw new Error(
                        `Stock insuficiente para ${productname}. Disponible: ${stock}`
                    );
                }

                const priceFinal = price - price * (discount / 100);
                return {
                    idproduct: Number(idproduct),
                    productname,
                    price,
                    discount,
                    quantity,
                    totalprice: priceFinal * quantity,
                };
            })
        );

        const itemsJson = JSON.stringify(resolvedItems);
        await cartModel.agregarAlCarrito(iduser, itemsJson);
        res.json({ message: "Carrito actualizado", items: resolvedItems });
    } catch (error) {
        console.error("Error al agregar al carrito:", error.message);
        res.status(400).json({
            error: error.message || "No se pudo procesar la solicitud",
        });
    }
});


// Vaciar el carrito de un usuario
router.delete("/cart/:iduser", async (req, res) => {
    try {
        await cartModel.vaciarCarrito(req.params.iduser);
        res.json({ message: "Carrito vaciado" });
    } catch (error) {
        console.error("Error al vaciar carrito:", error.message);
        res.status(500).json({ error: "No se pudo vaciar el carrito" });
    }
});

// Obtener todos los carritos
router.get("/cart", async (req, res) => {
    try {
        const carritos = await cartModel.getAllCarts();
        res.json(carritos);
    } catch (error) {
        console.error("Error al obtener carritos:", error.message);
        res.status(500).json({ error: "No se pudo obtener los carritos" });
    }
});

// Eliminar un producto del carrito
router.delete("/cart/:idcart/product/:idproduct", async (req, res) => {
    try {
        const { idcart, idproduct } = req.params;
        const result = await cartModel.eliminarProductoDelCarrito(
            parseInt(idcart),
            parseInt(idproduct)
        );
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.json({ message: result.message });
    } catch (error) {
        console.error("Error al eliminar producto:", error.message);
        res.status(500).json({ error: "No se pudo eliminar el producto" });
    }
});

// Modificar la cantidad de un producto en el carrito
router.put("/cart/:idcart/product/:idproduct", async (req, res) => {
    try {
        const { idcart, idproduct } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || isNaN(quantity)) {
            return res.status(400).json({ error: "Cantidad inválida" });
        }

        // Verificar stock disponible
        const productResponse = await axios.get(
            `http://productos:3001/productos/${idproduct}`
        );
        if (!productResponse.data) {
            return res
                .status(404)
                .json({ error: `Producto con ID ${idproduct} no encontrado` });
        }
        const { stock, productname } = productResponse.data;
        if (quantity > stock) {
            return res
                .status(400)
                .json({
                    error: `Stock insuficiente para ${productname}. Disponible: ${stock}`,
                });
        }

        const result = await cartModel.modificarCantidadProducto(
            parseInt(idcart),
            parseInt(idproduct),
            parseInt(quantity)
        );
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.json({ message: result.message, updatedItem: result.updatedItem });
    } catch (error) {
        console.error("Error al modificar cantidad:", error.message);
        res.status(500).json({ error: "No se pudo modificar la cantidad" });
    }
});

module.exports = router;
