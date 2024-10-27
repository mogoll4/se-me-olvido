# Sistema de Información para la Gestión de Ventas e Inventarios en Luminar - Local de Ropa Femenina

**Elaborado Por:**
- Eric Sebastián Gonzales
- Paula Andrea Ortiz
- Andres Mora
- Javier Andrés Abril

**Información General:**
- 2902093
- Centro de Gestión de Mercados, Logística y Tecnologías de la Información
- 30 de Septiembre, 2024
- Bogotá D.C.

## Nombre del Proyecto: Sistema de Información para la Gestión de Ventas e Inventarios en Luminar - Local de Ropa Femenina

### Descripción General
El proyecto tiene como objetivo la implementación de un sistema de gestión integral que permita a Luminar, un reconocido local de ropa femenina, optimizar sus procesos de inventario y ventas. Luminar se destaca por ofrecer prendas de alta calidad y estilo único, pero para mantener su competitividad y satisfacer las crecientes expectativas de sus clientes, es fundamental integrar un sistema digitalizado que mejore la eficiencia operativa. La solución propuesta incluirá herramientas avanzadas para el control de inventario en tiempo real, gestión de pedidos, y la creación de un sistema de ventas en línea. Esto no solo aumentará la eficiencia interna, sino que también permitirá a Luminar diversificar sus canales de venta, ampliando así su alcance en el mercado y mejorando su posición frente a la competencia.

## Características del Proyecto
- **Gestión de Inventario**: Registro de productos, control de existencias, actualización en tiempo real y notificación sobre bajas en inventario.
- **Gestión de Ventas**: Registro de ventas con validación de productos, gestión de pagos y reportes de ventas.
- **Canal de Ventas en Línea**: Plataforma eCommerce para que los clientes puedan realizar compras en línea de manera conveniente.
- **Registro y Login de Usuarios**: Registro de clientes y empleados con validación y hasheo seguro de contraseñas utilizando **bcryptjs**.
- **Análisis de Datos**: Herramientas para la recopilación y análisis de datos de ventas que faciliten la toma de decisiones.

## Tecnologías Utilizadas
- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor.
- **Express**: Framework web para Node.js.
- **MySQL**: Base de datos relacional para almacenar información de los productos, ventas y usuarios.
- **Sequelize**: ORM para facilitar las operaciones en la base de datos.
- **bcryptjs**: Librería para hashear contraseñas y asegurar la seguridad de la información de los usuarios.
- **dotenv**: Para la gestión de variables de entorno.
- **HTML, CSS, JavaScript**: Tecnologías para el diseño del front-end y la interfaz del sistema.

## Instalación
Sigue los pasos a continuación para configurar el proyecto localmente:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/MiPapaSeLlamaEdgar/Luminar
   cd luminar-gestion-ventas-inventarios

### Dependencias
- npm install express dotenv sequelize mysql2 body-parser bcryptjs jsonwebtoken cookie-parser cors

**Si quieres usar nodemon para facilitar el desarrollo, instala también:**
- npm install --save-dev nodemon

### Configurar las variables de entorno:
**Crea un archivo .env en la raíz del proyecto y agrega la configuración de tu base de datos:**
- DB_HOST=127.0.0.1
- DB_USER=root
- DB_PASSWORD=1234
- DB_NAME=luminar
- JWT_SECRET=supersecretkey
- PORT=5000

