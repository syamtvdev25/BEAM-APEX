
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Utility to convert ArrayBuffer to Base64 for Capacitor Filesystem
 */
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

/**
 * Handles saving and sharing a file across Web and Native platforms
 */
const saveAndShareFile = async (buffer: ArrayBuffer, fileName: string, mimeType: string) => {
  if (Capacitor.isNativePlatform()) {
    try {
      const base64Data = arrayBufferToBase64(buffer);
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });

      await Share.share({
        title: fileName,
        text: 'Exporting Report',
        url: savedFile.uri,
        dialogTitle: 'Share Report',
      });
    } catch (error) {
      console.error('Native Export Error:', error);
      alert('Error saving file to device.');
    }
  } else {
    // Web Fallback
    const blob = new Blob([buffer], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Excel Export using ExcelJS
 */
export const exportToExcel = async (data: any[], subtotal: any, country: string, dateRange: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Turnover Report');

  // Title and Headers
  worksheet.mergeCells('A1:J1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `COUNTRY TURNOVER REPORT - ${dateRange}`;
  titleCell.font = { bold: true, size: 14 };
  titleCell.alignment = { horizontal: 'center' };

  const columns = [
    { header: 'Brand', key: 'brand', width: 25 },
    { header: 'Sales Value', key: 'salesValue', width: 15 },
    { header: '2023', key: 'y2023', width: 15 },
    { header: '2024', key: 'y2024', width: 15 },
    { header: '2025', key: 'y2025', width: 15 },
    { header: '2026', key: 'y2026', width: 15 },
    { header: 'Same Day Last...', key: 'sameDay', width: 15 },
    { header: 'Diff Amount', key: 'diffAmount', width: 15 },
    { header: 'Diff%', key: 'diffPct', width: 12 },
    { header: 'Back Order Value', key: 'backOrder', width: 18 },
  ];
  
  worksheet.columns = columns;

  // Header Style
  worksheet.getRow(2).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };

  // Country Row
  worksheet.addRow({ brand: country });
  worksheet.lastRow!.font = { bold: true };
  worksheet.lastRow!.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };

  // Data Rows
  data.forEach((item) => {
    // Sanitize branding for export
    const sanitizedItem = { ...item };
    if (sanitizedItem.brand === 'TIGRIL') sanitizedItem.brand = 'APEX';
    
    const row = worksheet.addRow(sanitizedItem);
    // Conditional formatting for Diff cells
    const diffAmtCell = row.getCell(8);
    const diffPctCell = row.getCell(9);
    if (item.diffAmount < 0) diffAmtCell.font = { color: { argb: 'FFFF0000' } };
    else diffAmtCell.font = { color: { argb: 'FF008000' } };
    
    if (item.diffPct < 0) diffPctCell.font = { color: { argb: 'FFFF0000' } };
    else diffPctCell.font = { color: { argb: 'FF008000' } };
  });

  // Subtotal Row
  const subRow = worksheet.addRow({
    brand: subtotal.label,
    salesValue: subtotal.salesValue,
    y2023: subtotal.y2023,
    y2024: subtotal.y2024,
    y2025: subtotal.y2025,
    y2026: subtotal.y2026,
    sameDay: subtotal.sameDay,
    diffAmount: subtotal.diffAmount,
    diffPct: '',
    backOrder: subtotal.backOrder
  });
  subRow.font = { bold: true, color: { argb: 'FFFF0000' } };
  subRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };

  const buffer = await workbook.xlsx.writeBuffer();
  await saveAndShareFile(buffer, `CountryTurnover_${dateRange.replace(/\//g, '-')}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

/**
 * PDF Export using jsPDF + AutoTable
 */
export const exportToPdf = async (data: any[], subtotal: any, country: string, dateRange: string) => {
  const doc = new jsPDF({ orientation: 'landscape' });
  
  doc.setFontSize(16);
  doc.text('Country Turnover Report', 14, 15);
  doc.setFontSize(10);
  doc.text(`Period: ${dateRange}`, 14, 22);
  doc.text(`Country: ${country}`, 14, 27);

  const tableData = data.map(row => [
    row.brand === 'TIGRIL' ? 'APEX' : row.brand,
    row.salesValue.toLocaleString(),
    row.y2023.toLocaleString(),
    row.y2024.toLocaleString(),
    row.y2025.toLocaleString(),
    row.y2026.toLocaleString(),
    row.sameDay.toLocaleString(),
    row.diffAmount.toLocaleString(),
    row.diffPct.toFixed(2) + '%',
    row.backOrder.toLocaleString()
  ]);

  // Add subtotal row to data for PDF
  tableData.push([
    subtotal.label,
    subtotal.salesValue.toLocaleString(),
    subtotal.y2023.toLocaleString(),
    subtotal.y2024.toLocaleString(),
    subtotal.y2025.toLocaleString(),
    subtotal.y2026.toLocaleString(),
    subtotal.sameDay.toLocaleString(),
    subtotal.diffAmount.toLocaleString(),
    '',
    subtotal.backOrder.toLocaleString()
  ]);

  autoTable(doc, {
    startY: 35,
    head: [['Brand', 'Sales Value', '2023', '2024', '2025', '2026', 'Same Day LY', 'Diff Amt', 'Diff %', 'Backorder']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [0, 51, 102], fontSize: 8 },
    bodyStyles: { fontSize: 7 },
    didParseCell: (data: any) => {
      // Color subtotal row red
      if (data.row.index === tableData.length - 1) {
        data.cell.styles.textColor = [255, 0, 0];
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  const buffer = doc.output('arraybuffer');
  await saveAndShareFile(buffer, `CountryTurnover_${dateRange.replace(/\//g, '-')}.pdf`, 'application/pdf');
};
