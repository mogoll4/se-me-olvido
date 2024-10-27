const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize) => {
    const router = express.Router();
    const User = sequelize.models.Usuario;

    // Registrar usuario
    router.post('/register', async (req, res) => {
        const { nombre, apellido, correo_electronico, contrasena, rol } = req.body;

        // Validación de datos
        if (!nombre || !apellido || !correo_electronico || !contrasena) {
            return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
        }

        try {
            // Verificar si el usuario ya existe
            const userExistente = await User.findOne({ where: { correo_electronico } });
            if (userExistente) {
                console.error(`Error: El usuario con correo ${correo_electronico} ya existe.`);
                return res.status(400).json({ msg: 'El usuario ya existe. Por favor, intente con otro correo.' });
            }

            // Hashear la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contrasena, salt);

            // Asignar rol predeterminado si no se proporciona
            const userRole = rol || 1; // Si no se proporciona un rol, usar el rol predeterminado "1" (Cliente)

            // Crear nuevo usuario
            const nuevoUsuario = await User.create({
                nombre,
                apellido,
                correo_electronico,
                contrasena: hashedPassword,
                rol_id: userRole,
            });
            console.log(`Usuario creado con éxito con ID: ${nuevoUsuario.usuario_id} y correo: ${correo_electronico}`);

            // Crear y devolver token
            const payload = { userId: nuevoUsuario.usuario_id, rol_id: nuevoUsuario.rol_id, nombre: nuevoUsuario.nombre };
            const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_temporal', {
                expiresIn: '1h'
            });

            res.status(201).json({ token, rol_id: nuevoUsuario.rol_id });
        } catch (err) {
            console.error(`Error al registrar el usuario: ${err.message}`);
            res.status(500).json({ msg: `Error del servidor: ${err.message}` });
        }
    });

    // Login de usuario
    router.post('/login', async (req, res) => {
        const { correo_electronico, contrasena } = req.body;

        // Validación de datos
        if (!correo_electronico || !contrasena) {
            return res.status(400).json({ msg: 'Correo y contraseña son obligatorios.' });
        }

        try {
            // Verificar si el usuario existe
            const usuarioExistente = await User.findOne({ where: { correo_electronico } });
            if (!usuarioExistente) {
                console.error(`Error: Usuario no encontrado con el correo: ${correo_electronico}`);
                return res.status(400).json({ msg: 'Usuario o contraseña incorrectos.' });
            }

            // Verificar la contraseña
            const esContraseñaCorrecta = await bcrypt.compare(contrasena, usuarioExistente.contrasena);
            if (!esContraseñaCorrecta) {
                console.error(`Error: Contraseña incorrecta para el usuario con correo: ${correo_electronico}`);
                return res.status(400).json({ msg: 'Usuario o contraseña incorrectos.' });
            }

            // Crear y devolver token
            const payload = { userId: usuarioExistente.usuario_id, rol_id: usuarioExistente.rol_id, nombre: usuarioExistente.nombre };
            const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_temporal', {
                expiresIn: '1h'
            });

            console.log(`Inicio de sesión exitoso para el usuario con correo: ${correo_electronico}`);

            // Incluir rol_id y nombre en la respuesta
            res.status(200).json({ token, rol_id: usuarioExistente.rol_id, nombre: usuarioExistente.nombre });
        } catch (err) {
            console.error(`Error al intentar iniciar sesión: ${err.message}`);
            res.status(500).json({ msg: `Error del servidor: ${err.message}` });
        }
    });

    return router;
};
