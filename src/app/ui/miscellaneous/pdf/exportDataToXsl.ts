import { InterestedVehicle } from '@/app/libs/definitions';
import ExcelJS from 'exceljs';

const getImageLogo = async () => {
  const logoUrl = '/flowsups.png';
  try {
    const response = await fetch(logoUrl);
    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error al cargar el logo:', error);
    return null;
  }
};

const formatVehicle = (vehicle: InterestedVehicle) => {
  if (!vehicle) return 'N/A';

  const year = vehicle?.vehicle_manufacture_years?.year || '';
  const brand = vehicle?.vehicle_brands.brand.toUpperCase() || '';
  const model = vehicle?.vehicle_models.model || '';
  const vin = vehicle?.vehicle_identification_numbers.vin || '';
  const lastSixVin = vin?.slice(vin.length - 6, vin.length) || '';
  return `${year} ${brand} ${model} [${lastSixVin}]`;
};

interface options {
  returnBlob?: boolean;
  visibleColumns?: string[];
}

interface PdfHeaderCell {
  id: string;
  content: string;
  colSpan: number;
  rowSpan: number;
  isPlaceholder?: boolean;
}
type PdfHeaderRow = PdfHeaderCell[];

interface PdfData {
  headers: PdfHeaderRow[];
  body: string[][];
  columnWidths?: number[];
  maxDepth: number;
}

export async function exportDataToXls(
  pdfData: PdfData, // Changed from data: string[][]
  fileName = 'list.xlsx',
  colorView: boolean,
  options: options = { returnBlob: false, visibleColumns: [] }
) {
  if (!pdfData || !pdfData.body || pdfData.body.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('data-list');

  const headerRowsCount = pdfData.headers.length;
  const bodyStartRow = headerRowsCount + 1;

  const leafHeaderCells = pdfData.headers[pdfData.headers.length - 1]
    .filter(cell => !cell.isPlaceholder);

  const finalLeafHeaderCells = options.visibleColumns && options.visibleColumns.length > 0
    ? leafHeaderCells.filter(cell => options.visibleColumns?.includes(cell.id))
    : leafHeaderCells;

  worksheet.columns = finalLeafHeaderCells.map(cell => ({
    key: cell.id,
    header: cell.content.toUpperCase(),
    width: 15
  }));

  pdfData.headers.forEach((headerRow, rowIndex) => {
    let currentExcelCol = 1;
    headerRow.forEach(headerCell => {
      const isVisible = finalLeafHeaderCells.some(leaf => {
        if (headerCell.colSpan === 1 && headerCell.rowSpan === 1) {
          return leaf.id === headerCell.id;
        }
       
        return true;
      });

      if (headerCell.isPlaceholder || !isVisible) {
        currentExcelCol += headerCell.colSpan;
        return;
      }

      const startRow = rowIndex + 1;
      const endRow = startRow + headerCell.rowSpan - 1;
      const startCol = currentExcelCol;
      const endCol = startCol + headerCell.colSpan - 1;

      if (headerCell.colSpan > 1 || headerCell.rowSpan > 1) {
        worksheet.mergeCells(startRow, startCol, endRow, endCol);
      }

      const cell = worksheet.getCell(startRow, startCol);
      cell.value = headerCell.content;
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colorView ? 'FF43B9A5' : 'ffffffff' }
      };
      cell.font = {
        bold: true,
        color: { argb: colorView ? 'FFFFFFFF' : 'ff000000' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };

      currentExcelCol += headerCell.colSpan;
    });
  });

  pdfData.body.forEach((dataRow, rowIndex) => {
    const rowObject: { [key: string]: string } = {};
    dataRow.forEach((value, colIndex) => {
      if (finalLeafHeaderCells[colIndex]) {
        rowObject[finalLeafHeaderCells[colIndex].id] = value;
      }
    });
    
    const row1 = worksheet.addRow(rowObject);
    const row2 = worksheet.addRow({});

    const stripeColor = rowIndex % 2 === 0 ? 'FF00A78B' : 'FF43B9A5';
    [row1, row2].forEach(row => {
      if (!row) return;
      for (let i = 1; i <= finalLeafHeaderCells.length; i++) {
        const cell = row.getCell(i);
        cell.fill = {
          type: 'pattern',
          pattern: colorView ? 'solid' : 'none',
          fgColor: { argb: colorView ? stripeColor : '' },
        };
        cell.font = {
          color: { argb: colorView ? 'FFFFFFFF' : 'FF000000' },
        };
        cell.alignment = { vertical: 'top', horizontal: 'left' };
      }
    });

    row1.height = 20;
    row2.height = 20;
  });

  // Adjust column widths
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    worksheet.eachRow({ includeEmpty: true }, row => {
      if (column.key === undefined || column.key === null) return;

      const cell = row.getCell(column.key);
      if (cell && cell.value) {
        const cellValue = String(cell.value);
        if (cellValue.length > maxLength) {
          maxLength = cellValue.length;
        }
      }
    });
    column.width = Math.min(Math.max(maxLength + 2, column.width || 0), 50);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  if (options.returnBlob) return blob;

  //donwload
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}
