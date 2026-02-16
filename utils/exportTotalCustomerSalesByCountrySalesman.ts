
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
export const exportToExcel = async (data: any[], subtotal: any, filters: any) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');

  const dateRange = `${filters.fromDate} TO ${filters.toDate}`;

  // Title and Headers
  worksheet.mergeCells('A1:H1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `TOTAL CUSTOMER SALES BY COUNTRY - SALESMAN (${dateRange})`;
  titleCell.font = { bold: true, size: 12 };
  titleCell.alignment = { horizontal: 'center' };

  const columns = [
    { header: 'Client Name', key: 'clientName', width: 40 },
    { header: 'Brand', key: 'brand', width: 15 },
    { header: 'Country', key: 'country', width: 25 },
    { header: 'Sales Value', key: 'salesValue', width: 18 },
    { header: '2026', key: 'y2026', width: 18 },
    { header: 'Same Day Last...', key: 'sameDay', width: 18 },
    { header: 'Diff%', key: 'diffPct', width: 12 },
    { header: 'Backorder Value', key: 'backorderValue', width: 18 },
  ];
  
  worksheet.columns = columns;

  // Header Style
  worksheet.getRow(2).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } };

  // Data Rows
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // Subtotal Row
  const subRow = worksheet.addRow({
    clientName: subtotal.label,
    brand: '',
    country: '',
    salesValue: subtotal.salesValue,
    y2026: subtotal.y2026,
    sameDay: subtotal.sameDay,
    diffPct: '',
    backorderValue: subtotal.backorderValue
  });
  subRow.font = { bold: true, color: { argb: 'FFFF0000' } };

  const buffer = await workbook.xlsx.writeBuffer();
  await saveAndShareFile(buffer, `Total_Customer_Sales_By_Country_Salesman_${filters.fromDate}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

/**
 * PDF Export using jsPDF + AutoTable
 */
export const exportToPdf = async (data: any[], subtotal: any, filters: any) => {
  const doc = new jsPDF({ orientation: 'landscape' });
  
  const dateRange = `${filters.fromDate} TO ${filters.toDate}`;

  doc.setFontSize(14);
  doc.text('Total Customer Sales By Country - Salesman', 14, 15);
  doc.setFontSize(10);
  doc.text(`Period: ${dateRange}`, 14, 22);

  const tableData = data.map(row => [
    row.clientName,
    row.brand,
    row.country,
    row.salesValue.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    row.y2026.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    row.sameDay.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    row.diffPct.toFixed(2) + '%',
    row.backorderValue.toLocaleString(undefined, { minimumFractionDigits: 2 })
  ]);

  tableData.push([
    subtotal.label,
    '',
    '',
    subtotal.salesValue.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    subtotal.y2026.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    subtotal.sameDay.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    '',
    subtotal.backorderValue.toLocaleString(undefined, { minimumFractionDigits: 2 })
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['Client Name', 'Brand', 'Country', 'Sales Value', '2026', 'Same Day LY', 'Diff %', 'Backorder']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [0, 51, 102], fontSize: 8 },
    bodyStyles: { fontSize: 7 },
    didParseCell: (data: any) => {
      if (data.row.index === tableData.length - 1) {
        data.cell.styles.textColor = [255, 0, 0];
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  const buffer = doc.output('arraybuffer');
  await saveAndShareFile(buffer, `Total_Customer_Sales_By_Country_Salesman_${filters.fromDate}.pdf`, 'application/pdf');
};
