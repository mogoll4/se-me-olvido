// Ejemplo de datos
const dashboardData = [
    { id: 1, pago_id: "4456", orden_id: "7985", fecha_pago: "21/10/2024", monto: "$ 120.000",  metodo_pago: "Tarjeta de crédito"},
    { id: 2, pago_id: "8965", orden_id: "4665", fecha_pago: "01/10/2024", monto: "$ 200.000",  metodo_pago: "Nequi"},
    { id: 3, pago_id: "9864", orden_id: "1233", fecha_pago: "11/10/2024", monto: "$ 50.000",  metodo_pago: "Dinero Fisico"},
    { id: 4, pago_id: "8544", orden_id: "7894", fecha_pago: "21/08/2024", monto: "$ 20.000",  metodo_pago: "Dinero Fisico"},
    { id: 5, pago_id: "1345", orden_id: "8521", fecha_pago: "02/04/2024", monto: "$ 60.000",  metodo_pago: "Tarjeta Débito"},
    { id: 6, pago_id: "9632", orden_id: "7531", fecha_pago: "14/09/2024", monto: "$ 50.000",  metodo_pago: "Nequi"},
];

// Función para crear la tabla del tablero
function createDashboard() {
    const dashboard = document.getElementById('dashboard');
    const table = document.createElement('table');
    const headers = ['ID', 'PAGO_ID', 'ORDEN_ID', 'FECHA_PAGO', 'MONTO',  'METODO_PAGO'];

    // Crear encabezado de tabla
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Crear filas de tabla
    dashboardData.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });

        // Agregar botón de acción
        const actionTd = document.createElement('td');
        const reportButton = document.createElement('button');
        reportButton.textContent = 'Generar Reporte';
        reportButton.onclick = () => generateIndividualReport(item);
        actionTd.appendChild(reportButton);
        row.appendChild(actionTd);

        table.appendChild(row);
    });

    dashboard.appendChild(table);
}

// Función para generar un informe general
function generateGeneralReport() {
    const reportContainer = document.getElementById('reportContainer');
    reportContainer.innerHTML = '<h2>Reporte General</h2>';

    const table = document.createElement('table');
    const headers = ['ID', 'PAGO_ID', 'ORDEN_ID', 'FECHA_PAGO', 'MONTO',  'METODO_PAGO'];

    // Crear encabezado de tabla
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Crear filas de tabla
    dashboardData.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    reportContainer.appendChild(table);
}

// Función para generar un informe individual
function generateIndividualReport(item) {
    const reportContainer = document.getElementById('reportContainer');
    reportContainer.innerHTML = `<h2>Informe individual por pedido con id ${item.orden_id}</h2>`;

    const table = document.createElement('table');
    Object.entries(item).forEach(([key, value]) => {
        const row = document.createElement('tr');
        const keyTd = document.createElement('td');
        const valueTd = document.createElement('td');
        keyTd.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        valueTd.textContent = value;
        row.appendChild(keyTd);
        row.appendChild(valueTd);
        table.appendChild(row);
    });

    reportContainer.appendChild(table);
}

// Función para exportar informe a PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const reportContainer = document.getElementById('reportContainer');
    const table = reportContainer.querySelector('table');

    // Add logo
    const logoUrl = '../public/assets/img/Logo-Luminar.png';
    doc.addImage(logoUrl, 'JPEG', 5, 5, 25, 10);
    
    // Añadir título
    const title = reportContainer.querySelector('h2').textContent;
    doc.text(title, 105, 15, null, null, 'center');
    
    // Agregar tabla
    doc.setFontSize(10);
    doc.setTextColor(99, 99, 99);
    
    // Encabezado de tabla
    let yPos = 30;
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
    headers.forEach((header, index) => {
        doc.setFont("helvetica", "bold");
        doc.text(header, 10 + (index * 25), yPos);
    });
    
    // Filas de la tabla
    doc.setFont("helvetica", "normal");
    Array.from(table.querySelectorAll('tr')).slice(1).forEach((row) => {
        yPos += 10;
        Array.from(row.querySelectorAll('td')).forEach((cell, cellIndex) => {
            doc.text(cell.textContent, 10 + (cellIndex * 25), yPos);
        });
        
    });
    
    // Añadir borde a la tabla
    doc.setDrawColor(200, 200, 200);
    doc.rect(10, 25, 190, yPos - 20);
    
    // Agregar pie de página
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated on ' + new Date().toLocaleString(), 10, 285);
    
    doc.save('report.pdf');
}

// Función para exportar informe a Excel
function exportToExcel() {
    const reportContainer = document.getElementById('reportContainer');
    const ws = XLSX.utils.table_to_sheet(reportContainer.querySelector('table'));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "report.xlsx");
}

// Inicializar el Dashboard
document.addEventListener('DOMContentLoaded', () => {
    createDashboard();

    document.getElementById('generateGeneralReport').addEventListener('click', generateGeneralReport);
    document.getElementById('exportPDF').addEventListener('click', exportToPDF);
    document.getElementById('exportExcel').addEventListener('click', exportToExcel);
});