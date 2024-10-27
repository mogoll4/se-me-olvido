const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const path = require('path');

// Generar reporte en PDF
exports.generarReportePDF = (req, res) => {
    const doc = new PDFDocument();
    const filename = "reporte.pdf";
    
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');
    
    doc.pipe(res);
    
    // Título
    doc.fontSize(20).text("Reporte de Usuarios", { align: 'center' });
    doc.moveDown();

    // Datos de ejemplo (puedes obtener estos datos de la base de datos)
    const usuarios = [
        { id: 1, nombre: 'Andrés', apellido: 'Mora', correo: 'andres@mail.com' },
        { id: 2, nombre: 'Paula', apellido: 'Ramírez', correo: 'paula@mail.com' }
    ];
    
    usuarios.forEach((user) => {
        doc.fontSize(12).text(`ID: ${user.id}`);
        doc.text(`Nombre: ${user.nombre} ${user.apellido}`);
        doc.text(`Correo: ${user.correo}`);
        doc.moveDown();
    });
    
    doc.end();
};

// Generar reporte en Excel
exports.generarReporteExcel = (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte de Usuarios");

    worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Nombre", key: "nombre", width: 30 },
        { header: "Apellido", key: "apellido", width: 30 },
        { header: "Correo", key: "correo", width: 30 },
    ];

    // Datos de ejemplo
    const usuarios = [
        { id: 1, nombre: 'Andrés', apellido: 'Mora', correo: 'andres@mail.com' },
        { id: 2, nombre: 'Paula', apellido: 'Ramírez', correo: 'paula@mail.com' }
    ];

    usuarios.forEach(user => {
        worksheet.addRow(user);
    });

    res.setHeader(
        'Content-Disposition',
        'attachment; filename="reporte.xlsx"'
    );

    workbook.xlsx.write(res).then(() => {
        res.end();
    });
};
