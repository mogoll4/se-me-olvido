// Importaciones necesarias
const express = require('express');

module.exports = (sequelize) => {
    const router = express.Router();
    const Product = sequelize.models.Productos;
    const Category = sequelize.models.Categorias;
    const User = sequelize.models.Usuarios;
    const Order = sequelize.models.Ordenes;
    const OrderDetail = sequelize.models.Detalle_Ordenes;

    // Rutas para Gestión de Inventario (CRUD de productos)

    // Crear un nuevo producto
    router.post('/productos', async (req, res) => {
        const { nombre_producto, descripcion, talla, color, precio, cantidad_stock, categoria_id } = req.body;
        try {
            // Verificar si la categoría existe
            const category = await Category.findByPk(categoria_id);
            if (!category) {
                return res.status(400).json({ msg: 'Categoría no válida. Por favor, selecciona una categoría existente.' });
            }

            // Crear el nuevo producto
            const newProduct = await Product.create({
                nombre_producto,
                descripcion,
                talla,
                color,
                precio,
                cantidad_stock,
                categoria_id
            });
            console.log("Producto creado exitosamente:", newProduct);  // Confirmación de creación del producto
            res.status(201).json(newProduct);
        } catch (err) {
            console.error('Error al crear producto:', err.message);
            res.status(500).send('Error del servidor. No se pudo crear el producto.');
        }
    });

    // Obtener todos los productos
    router.get('/productos', async (req, res) => {
        try {
            const productos = await Product.findAll();
            console.log("Productos obtenidos:", productos);  // Confirmación de productos obtenidos
            res.json(productos);
        } catch (err) {
            console.error('Error al obtener productos:', err.message);
            res.status(500).send('Error del servidor. No se pudo obtener los productos.');
        }
    });

    // Actualizar un producto
    router.put('/productos/:id', async (req, res) => {
        const { id } = req.params;
        const { nombre_producto, descripcion, talla, color, precio, cantidad_stock, categoria_id } = req.body;
        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ msg: 'Producto no encontrado.' });
            }

            // Verificar si la categoría existe
            const category = await Category.findByPk(categoria_id);
            if (!category) {
                return res.status(400).json({ msg: 'Categoría no válida. Por favor, selecciona una categoría existente.' });
            }

            // Actualizar el producto
            await product.update({
                nombre_producto,
                descripcion,
                talla,
                color,
                precio,
                cantidad_stock,
                categoria_id
            });
            console.log("Producto actualizado:", product);  // Confirmación de actualización del producto
            res.json(product);
        } catch (err) {
            console.error('Error al actualizar producto:', err.message);
            res.status(500).send('Error del servidor. No se pudo actualizar el producto.');
        }
    });

    // Eliminar un producto
    router.delete('/productos/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ msg: 'Producto no encontrado.' });
            }
            await product.destroy();
            console.log("Producto eliminado con ID:", id);  // Confirmación de eliminación del producto
            res.json({ msg: 'Producto eliminado con éxito.' });
        } catch (err) {
            console.error('Error al eliminar producto:', err.message);
            res.status(500).send('Error del servidor. No se pudo eliminar el producto.');
        }
    });

    // Gestión de Categorías de Productos

    // Crear una nueva categoría
    router.post('/categorias', async (req, res) => {
        const { nombre_categoria } = req.body;
        try {
            const newCategory = await Category.create({ nombre_categoria });
            console.log("Categoría creada exitosamente:", newCategory);  // Confirmación de creación de categoría
            res.status(201).json(newCategory);
        } catch (err) {
            console.error('Error al crear categoría:', err.message);
            res.status(500).send('Error del servidor. No se pudo crear la categoría.');
        }
    });

    // Obtener todas las categorías
    router.get('/categorias', async (req, res) => {
        try {
            const categorias = await Category.findAll();
            console.log("Categorías obtenidas:", categorias);  // Confirmación de categorías obtenidas
            res.json(categorias);
        } catch (err) {
            console.error('Error al obtener categorías:', err.message);
            res.status(500).send('Error del servidor. No se pudo obtener las categorías.');
        }
    });

    // Gestión de Ventas

    // Registrar una venta
    router.post('/ventas', async (req, res) => {
        const { cliente_id, usuario_id, productos } = req.body; // productos es un array de { producto_id, cantidad }
        try {
            // Crear la orden
            const total = productos.reduce((acc, prod) => acc + prod.precio_unitario * prod.cantidad, 0);
            const newOrder = await Order.create({ cliente_id, usuario_id, fecha_orden: new Date(), total });
            console.log("Orden creada exitosamente:", newOrder);  // Confirmación de la creación de la orden

            // Crear detalles de la orden y actualizar stock
            for (const prod of productos) {
                const product = await Product.findByPk(prod.producto_id);
                if (product && product.cantidad_stock >= prod.cantidad) {
                    await OrderDetail.create({
                        orden_id: newOrder.orden_id,
                        producto_id: prod.producto_id,
                        cantidad: prod.cantidad,
                        precio_unitario: prod.precio_unitario
                    });
                    // Actualizar stock
                    product.cantidad_stock -= prod.cantidad;
                    await product.save();
                    console.log("Producto actualizado tras venta:", product);  // Confirmación de la actualización del stock del producto
                } else {
                    return res.status(400).json({ msg: `Stock insuficiente para el producto: ${product.nombre_producto}` });
                }
            }
            res.status(201).json(newOrder);
        } catch (err) {
            console.error('Error al registrar venta:', err.message);
            res.status(500).send('Error del servidor. No se pudo registrar la venta.');
        }
    });

    return router;
};
