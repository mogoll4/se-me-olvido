document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const formContainer = document.querySelector('.form-container');
    const addBtn = document.getElementById('addBtn');
    const productoForm = document.getElementById('productoForm');
    const cancelBtn = document.getElementById('cancelBtn');

    // Event Listeners
    addBtn.addEventListener('click', showForm);
    cancelBtn.addEventListener('click', hideForm);
    productoForm.addEventListener('submit', handleSubmit);

    // Función para mostrar el formulario
    function showForm() {
        formContainer.style.display = 'block';
        productoForm.reset();
        document.getElementById('producto_id').value = '';
        document.querySelector('.form-title').textContent = 'Nuevo Producto';
    }

    // Función para ocultar el formulario
    function hideForm() {
        formContainer.style.display = 'none';
        productoForm.reset();
    }

    // Función para manejar el envío del formulario
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const formData = new FormData(productoForm);
            const productoId = document.getElementById('producto_id').value;

            const response = await fetch(
                productoId ? `/api/crud/productos/${productoId}` : '/api/crud/productos',
                {
                    method: productoId ? 'PUT' : 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.msg);
            }

            await Swal.fire({
                icon: 'success',
                title: productoId ? 'Producto actualizado' : 'Producto creado',
                timer: 2000,
                showConfirmButton: false
            });

            hideForm();
            loadProductos();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }

    // Cargar productos al iniciar
    loadProductos();
});