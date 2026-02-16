
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAndShareFile } from './saveAndShareFile';

export const exportToExcel = async (data: any[], subtotal: any, country: string, dateRange: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Turnover');

  worksheet.addRow([`COUNTRY TURNOVER REPORT: ${country}`]);
  worksheet.addRow([`Period: ${dateRange}`]);
  worksheet.addRow([]);

  const header = ['Brand', 'Sales Value', '2023', '2024', '2025', '2026', 'Same Day LY', 'Diff Amt', 'Diff%', 'Backorder'];
  const headerRow = worksheet.addRow(header);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };
  });

  data.forEach((row) => {
    worksheet.addRow([
      row.brand,
      row.salesValue,
      row.y2023,
      row.y2024,
      row.y2025,
      row.y2026,
      row.sameDay,
      row.diffAmount,
      row.diffPct ? `${row.diffPct.toFixed(2)}%` : '0%',
      row.backOrder
    ]);
  });

  const subRow = worksheet.addRow([
    subtotal.label,
    subtotal.salesValue,
    subtotal.y2023,
    subtotal.y2024,
    subtotal.y2025,
    subtotal.y2026,
    subtotal.sameDay,
    subtotal.diffAmount,
    '',
    subtotal.backOrder
  ]);
  subRow.font = { bold: true, color: { argb: 'FFFF0000' } };

  const buffer = await workbook.xlsx.writeBuffer();
  await saveAndShareFile(buffer, `CountryTurnover_${country.replace(/\s/g, '_')}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

export const exportToPdf = async (data: any[], subtotal: any, country: string, dateRange: string) => {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(14);
  doc.text(`Turnover Report: ${country}`, 14, 15);
  doc.setFontSize(10);
  doc.text(`Range: ${dateRange}`, 14, 22);

  const body = data.map(r => [
    r.brand, r.salesValue.toLocaleString(), r.y2023.toLocaleString(), r.y2024.toLocaleString(),
    r.y2025.toLocaleString(), r.y2026.toLocaleString(), r.sameDay.toLocaleString(),
    r.diffAmount.toLocaleString(), r.diffPct ? `${r.diffPct.toFixed(2)}%` : '0%', r.backOrder.toLocaleString()
  ]);

  body.push([
    subtotal.label, subtotal.salesValue.toLocaleString(), subtotal.y2023.toLocaleString(),
    subtotal.y2024.toLocaleString(), subtotal.y2025.toLocaleString(), subtotal.y2026.toLocaleString(),
    subtotal.sameDay.toLocaleString(), subtotal.diffAmount.toLocaleString(), '', subtotal.backOrder.toLocaleString()
  ]);

  autoTable(doc, {
    startY: 28,
    head: [['Brand', 'Sales', '2023', '2024', '2025', '2026', 'SDLY', 'Diff', 'Diff%', 'B.Order']],
    body,
    headStyles: { fillColor: [0, 51, 102], fontSize: 8 },
    bodyStyles: { fontSize: 7 },
    didParseCell: (data) => {
      if (data.row.index === body.length - 1) {
        data.cell.styles.textColor = [255, 0, 0];
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  await saveAndShareFile(doc.output('arraybuffer'), `CountryTurnover_${country.replace(/\s/g, '_')}.pdf`, 'application/pdf');
};
