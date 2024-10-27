const express = require('express');
const router = express.Router();
const Notification = require('../models/notification.model');

// Crear una nueva notificación
router.post('/notification', async (req, res) => {
    const { user_id, type, message } = req.body;
    try {
        const notification = await Notification.create({ user_id, type, message });
        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la notificación' });
    }
});

// Obtener notificaciones de un usuario
router.get('/notifications/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await Notification.findAll({ where: { user_id: userId } });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener notificaciones' });
    }
});

module.exports = router;
