document.addEventListener("DOMContentLoaded", cargarPedidos);
document.getElementById("pedidoForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Previene el comportamiento de recarga de página

    // Obtiene los valores de los campos
    const clienteId = document.getElementById("clienteId").value;
    const total = document.getElementById("total").value;
    const fecha = document.getElementById("fecha").value;

    // Verifica que los campos no estén vacíos
    if (!clienteId || !total || !fecha) {
        alert("Por favor completa todos los campos");
        return;
    }

    // Construye el objeto de pedido
    const pedido = {
        clienteId,
        total,
        fecha
    };

    // Envía el pedido al servidor
    guardarPedido(pedido);
});

function guardarPedido(pedido) {
    fetch("/api/pedidos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pedido)
    })
    .then(response => {
        if (response.ok) {
            alert("Pedido guardado correctamente");
            // Recarga o actualiza la lista de pedidos
            cargarPedidos();
            cerrarFormularioPedido();
        } else {
            alert("Error al guardar el pedido");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error al guardar el pedido");
    });
}

function verDetalles(orden_id) {
    fetch(`/api/pedidos/${orden_id}/detalle`)
        .then(response => response.json())
        .then(detalles => {
            const detalleOrden = document.getElementById("detalleOrden");
            detalleOrden.innerHTML = "";

            detalles.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.producto_nombre}</td>
                        <td>${item.cantidad}</td>
                        <td>${item.precio_unitario}</td>
                        <td>${(item.cantidad * item.precio_unitario).toFixed(2)}</td>
                    </tr>
                `;
                detalleOrden.innerHTML += row;
            });

            document.getElementById("detallePedido").style.display = "block";
        })
        .catch(error => console.error("Error obteniendo detalles:", error));
}

function mostrarFormularioPedido() {
    document.getElementById("pedidoModal").style.display = "block";
    document.getElementById("modalTitle").innerText = "Nuevo Pedido";
    document.getElementById("pedidoForm").reset();
    document.getElementById("pedidoId").value = "";
}

function cerrarFormularioPedido() {
    document.getElementById("pedidoModal").style.display = "none";
}

document.getElementById("pedidoForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("pedidoId").value;
    const clienteId = document.getElementById("clienteId").value;
    const total = document.getElementById("total").value;
    const fecha = document.getElementById("fecha").value;

    const payload = { cliente_id: clienteId, total, fecha };

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/pedidos/${id}` : "/api/pedidos";

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(() => {
            cargarPedidos();
            cerrarFormularioPedido();
        })
        .catch(error => console.error("Error al guardar pedido:", error));
});

function eliminarPedido(id) {
    fetch(`/api/pedidos/${id}`, { method: "DELETE" })
        .then(() => cargarPedidos())
        .catch(error => console.error("Error al eliminar pedido:", error));
}

function ocultarDetalles() {
    document.getElementById("detallePedido").style.display = "none";
}

app.post("/api/pedidos", (req, res) => {
    const { clienteId, total, fecha } = req.body;

    // Asegúrate de validar los datos antes de guardarlos
    if (!clienteId || !total || !fecha) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const query = "INSERT INTO Ordenes (cliente_id, fecha_orden, total) VALUES (?, ?, ?)";
    const values = [clienteId, fecha, total];

    db.query(query, values, (error, result) => {
        if (error) {
            console.error("Error al guardar el pedido:", error);
            return res.status(500).json({ error: "Error al guardar el pedido" });
        }
        res.status(201).json({ message: "Pedido guardado correctamente" });
    });
});
