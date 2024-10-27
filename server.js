require('dotenv').config();
const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const reporteController = require('./controllers/reporte');
const notificationRoutes = require('./controllers/notification.controller');
app.use('/', notificationRoutes);
const express = require('express');
const router = express.Router();
const db = require('./luminar.db'); // Asegúrate de tener configurada tu base de datos

// Crear un pedido
router.post('/pedidos', async (req, res) => {
    const { nombre, cantidad, precio } = req.body;
    try {
        await db.query('INSERT INTO pedidos (nombre, cantidad, precio) VALUES (?, ?, ?)', [nombre, cantidad, precio]);
        res.status(201).json({ message: 'Pedido creado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pedido' });
    }
});

// Leer todos los pedidos
router.get('/pedidos', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM pedidos');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos' });
    }
});

// Actualizar un pedido
router.put('/pedidos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, cantidad, precio } = req.body;
    try {
        await db.query('UPDATE pedidos SET nombre = ?, cantidad = ?, precio = ? WHERE id = ?', [nombre, cantidad, precio, id]);
        res.status(200).json({ message: 'Pedido actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el pedido' });
    }
});

// Eliminar un pedido
router.delete('/pedidos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM pedidos WHERE id = ?', [id]);
        res.status(200).json({ message: 'Pedido eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pedido' });
    }
});

module.exports = router;


const app = express();

//Generacion de reportes PDF/EXCEL
app.get('/reporte/pdf', reporteController.generarReportePDF);
app.get('/reporte/excel', reporteController.generarReporteExcel);

// Middlewares para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configurar carpeta de archivos estáticos (public)
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MySQL usando Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

// Verificar la conexión a la base de datos
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado a MySQL');
    } catch (err) {
        console.error('Error de conexión a MySQL:', err.message);
        process.exit(1);
    }
})();

// Definir el modelo de Pedido
const Pedido = sequelize.define('Pedido', {
    pedido_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cliente: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
}, {
    tableName: 'Pedidos',
    timestamps: false,
});

// Definir el modelo de Usuario
const User = sequelize.define('Usuario', {
    usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo_electronico: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Usuarios',
    timestamps: false,
});

// Definir el modelo de Rol
const Role = sequelize.define('Rol', {
    rol_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Roles',
    timestamps: false,
});

// Relación entre Usuarios y Roles
User.belongsTo(Role, { foreignKey: 'rol_id', as: 'rol' });

// Sincronizar los modelos con la base de datos
(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados');
    } catch (err) {
        console.error('Error sincronizando modelos:', err.message);
        process.exit(1);
    }
})();

// Importar y usar el módulo de autenticación
try {
    const authRoutes = require('./controllers/auth')(sequelize);
    app.use('/', authRoutes);
    console.log('Rutas de autenticación cargadas correctamente.');
} catch (err) {
    console.error('Error al cargar las rutas de autenticación:', err.message);
}

// Rutas CRUD para Pedidos
app.post('/api/pedidos', async (req, res) => {
    try {
        const { cliente, total, fecha } = req.body;
        const nuevoPedido = await Pedido.create({ cliente, total, fecha });
        res.status(201).json(nuevoPedido);
    } catch (err) {
        console.error('Error al crear pedido:', err.message);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

app.get('/api/pedidos', async (req, res) => {
    try {
        const pedidos = await Pedido.findAll();
        res.json(pedidos);
    } catch (err) {
        console.error('Error al obtener pedidos:', err.message);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

app.put('/api/pedidos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { cliente, total, fecha } = req.body;
        const pedido = await Pedido.findByPk(id);
        
        if (!pedido) {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }

        pedido.cliente = cliente;
        pedido.total = total;
        pedido.fecha = fecha;
        await pedido.save();

        res.json(pedido);
    } catch (err) {
        console.error('Error al actualizar pedido:', err.message);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

app.delete('/api/pedidos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await Pedido.findByPk(id);
        
        if (!pedido) {
            return res.status(404).json({ msg: 'Pedido no encontrado' });
        }

        await pedido.destroy();
        res.json({ msg: 'Pedido eliminado' });
    } catch (err) {
        console.error('Error al eliminar pedido:', err.message);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// Rutas CRUD para Usuarios
app.post('/api/usuarios', async (req, res) => {
    try {
        const { nombre, apellido, correo_electronico, contrasena, rol_id } = req.body;
        const nuevoUsuario = await User.create({ nombre, apellido, correo_electronico, contrasena, rol_id });
        res.status(201).json(nuevoUsuario);
    } catch (err) {
        console.error('Error al crear usuario:', err.message);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await User.findAll({
            include: { model: Role, as: 'rol', attributes: ['nombre'] } // Incluye la información del rol
        });
        res.json(usuarios);
    } catch (err) {
        console.error('Error al obtener usuarios:', err.message);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await User.findByPk(id, {
            include: { model: Role, as: 'rol', attributes: ['nombre'] } // Incluye la información del rol
        });
        
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (err) {
        console.error('Error al obtener usuario:', err.message);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, correo_electronico, contrasena, rol_id } = req.body;
        const usuario = await User.findByPk(id);
        
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        usuario.nombre = nombre;
        usuario.apellido = apellido;
        usuario.correo_electronico = correo_electronico;
        usuario.contrasena = contrasena;
        usuario.rol_id = rol_id;
        await usuario.save();

        res.json(usuario);
    } catch (err) {
        console.error('Error al actualizar usuario:', err.message);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await User.findByPk(id);
        
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        await usuario.destroy();
        res.json({ msg: 'Usuario eliminado' });
    } catch (err) {
        console.error('Error al eliminar usuario:', err.message);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});


// Rutas para vistas HTML
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'login-register.html'));
    } catch (err) {
        console.error('Error al cargar la página de login/register:', err.message);
        res.status(500).json({ msg: `Error del servidor: Error al cargar la página de login/register.` });
    }
});

app.get('/accounts', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'accounts.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'checkout.html'));
});

app.get('/dashboard-admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard-admin.html'));
});

app.get('/dashboard-cliente', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard-cliente.html'));
});

app.get('/dashboard-vendedor', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard-vendedor.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/productos', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'productos.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'shop.html'));
});

app.get('/whishlist', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'whishlist.html'));
});

// (Aquí mantengo tus rutas de vistas originales)

app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'login-register.html'));
    } catch (err) {
        console.error('Error al cargar la página de login/register:', err.message);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
return router;
