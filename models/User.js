const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
        defaultValue: 1,
    },
    fecha_registro: {
        type: DataTypes.DATEONLY, // Usar DataTypes.DATEONLY para fechas sin horas
        allowNull: false,
        defaultValue: Sequelize.NOW,  // Establecer la fecha actual como valor predeterminado
    },
}, {
    tableName: 'Usuarios',
    timestamps: false,
});

    return User;
};
