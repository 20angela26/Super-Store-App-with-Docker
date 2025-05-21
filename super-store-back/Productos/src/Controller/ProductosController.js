const { Router } = require("express");
const router = Router();
const ProductosModel = require("../Model/ProductosModel");

// Crear un nuevo producto
router.post("/productos", async (req, res) => {
    try {
        await ProductosModel.create(req.body);
        res.status(201).json({ message: "Producto creado" });
    } catch (error) {
        console.error("Error al crear producto:", error.message);
        res.status(500).json({ error: "No se pudo crear el producto" });
    }
});

// Actualizar el stock de un producto
router.put("/productos/stock/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        if (stock === undefined || isNaN(stock) || stock < 0) {
            return res
                .status(400)
                .json({ error: "El stock debe ser un número válido" });
        }

        const product = await ProductosModel.getById(id);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await ProductosModel.updateStock(id, stock);
        res.json({ message: "Stock actualizado" });
    } catch (error) {
        console.error("Error al actualizar stock:", error.message);
        res.status(500).json({ error: "No se pudo actualizar el stock" });
    }
});

// Actualizar el descuento de un producto
router.put("/productos/discount/:id", async (req, res) => {
    try {
        await ProductosModel.updateDiscount(req.params.id, req.body.discount);
        res.json({ message: "Descuento actualizado" });
    } catch (error) {
        console.error("Error al actualizar descuento:", error.message);
        res.status(500).json({ error: "No se pudo actualizar el descuento" });
    }
});

// Eliminar un producto
router.delete("/productos/:id", async (req, res) => {
    try {
        await ProductosModel.delete(req.params.id);
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        console.error("Error al eliminar producto:", error.message);
        res.status(500).json({ error: "No se pudo eliminar el producto" });
    }
});

// Obtener todos los productos
router.get("/productos", async (req, res) => {
    try {
        const products = await ProductosModel.getAll();
        res.json(products);
    } catch (error) {
        console.error("Error al obtener productos:", error.message);
        res.status(500).json({ error: "No se pudo obtener los productos" });
    }
});

// Obtener un producto por ID
router.get("/productos/:id", async (req, res) => {
    try {
        const product = await ProductosModel.getById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error al obtener producto:", error.message);
        res.status(500).json({ error: "No se pudo obtener el producto" });
    }
});

// Reducir el stock de un producto
router.put("/productos/reduce-stock/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || isNaN(quantity) || quantity < 0) {
            return res
                .status(400)
                .json({ error: "La cantidad debe ser un número válido" });
        }

        const product = await ProductosModel.getById(id);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        await ProductosModel.reduceStock(id, quantity);
        res.json({ message: "Stock reducido" });
    } catch (error) {
        console.error("Error al reducir stock:", error.message);
        res.status(400).json({
            error: error.message || "No se pudo reducir el stock",
        });
    }
});

module.exports = router;
