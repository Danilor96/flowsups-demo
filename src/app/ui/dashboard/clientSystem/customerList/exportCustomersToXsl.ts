import { ClientType, InterestedVehicle } from '@/app/libs/definitions';
import ExcelJS from 'exceljs';

function makeRichTextForAssignedTo(label: string, value: string, colorView: boolean = true) {
  return [
    { text: `${label}: `, font: { bold: true, color: { argb: colorView ? 'ffffff' : 'ff000000' } } },
    { text: value, font: { bold: false, color: { argb: colorView ? 'ffffff' : 'ff000000' } } }
  ];
}

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

const formatPhone = (phone: string | null | undefined) => {
  if (!phone) return 'N/A';
  const customerContactArray = phone?.split('');
  const customerContactFormatted = `${customerContactArray?.slice(0, 3).join('')}-${customerContactArray
    ?.slice(3, 6)
    .join('')}-${customerContactArray?.slice(6, 10).join('')}`;
  return customerContactFormatted;
};

const formatVehicle = (vehicle: InterestedVehicle) => {
  if (!vehicle) return 'N/A';

  const year = vehicle?.vehicle_manufacture_years?.year || '';
  const brand = vehicle?.vehicle_brands.brand.toUpperCase() || '';
  const model = vehicle?.vehicle_models.model || '';
  const vin = vehicle?.vehicle_identification_numbers.vin || '';
  const lastSixVin = vin?.slice(vin.length - 6, vin.length) || '';
  const stockNo = vehicle?.stock_no || '';
  const lastSixStockNo = stockNo ? `[${stockNo.slice(-6)}]` : '';
  return `${year} ${brand} ${model} ${lastSixStockNo}`;
};

interface ColumnDefinitionType {
  [key: string]: {
    header: string;
    key: string;
    width: number;
    render?: (client: ClientType, colorView?: boolean) => string | { richText: any };
  };
}

const COLUMNS_DEFINITION: ColumnDefinitionType = {
  customer_name: {
    header: 'Customer Name',
    key: 'name',
    width: 20,
    render: (client: ClientType, colorView?: boolean) => `${client.first_name || ''} ${client.last_name || ''}`
  },
  assigned_to: {
    header: 'Assigned To',
    key: 'assignedTo',
    width: 30,
    render: (client, colorView) => {
      const salesRep = `${
        client.seller ? `${client.seller.name || ''} ${client.seller.last_name || ''}`.trim() : 'N/A'
      }`;
      const assignedToSalesRichText = makeRichTextForAssignedTo('Sales Rep', salesRep, colorView);
      return { richText: assignedToSalesRichText };
    }
  },
  phone_number: { header: 'Phone', key: 'phone', width: 15, render: client => formatPhone(client.mobile_phone) },
  credit_app: {
    header: 'Credit App',
    key: 'creditApp',
    width: 12,
    render: client => (client.credit_app_list_status_id ? 'Yes' : 'No')
  },
  source: { header: 'Source', key: 'source', width: 15, render: client => client.lead_source?.source || 'N/A' },
  city: { header: 'City', key: 'city', width: 15, render: client => client.client_address?.city || 'N/A' },
  state: { header: 'State', key: 'state', width: 12, render: client => client.client_address?.state?.state || 'N/A' },
  status: {
    header: 'Status',
    key: 'status',
    width: 15,
    render: client =>
      client.client_status?.status
        ? client.client_status.status[0].toUpperCase() + client.client_status.status.slice(1)
        : 'N/A'
  },
  created_date: {
    header: 'Created Date',
    key: 'createdDate',
    width: 15,
    render: client => (client.created_at ? new Date(client.created_at).toLocaleDateString() : 'N/A')
  },
  created_by: { header: 'Created By', key: 'createdBy', width: 15, render: client => 'User Admin' },
  interested_vehicle: {
    header: 'Interested Vehicle',
    key: 'vehicle',
    width: 25,
    render: client => formatVehicle(client.interested_vehicle)
  }
};

interface options {
  returnBlob?: boolean;
  visibleColumns?: string[];
}

export async function exportClientsToExcelV2(
  clients: ClientType[],
  fileName = 'customer-list.xlsx',
  colorView: boolean,
  options: options = { returnBlob: false, visibleColumns: [] }
) {
  if (!clients || clients.length === 0) return;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Clientes');
  // const logoBuffer = await getImageLogo();
  // // 2. Añadir imagen al workbook
  // if (logoBuffer) {
  //   const logoId = workbook.addImage({
  //     buffer: logoBuffer,
  //     extension: 'png' // Ajusta según el formato (png, jpeg, etc.)
  //   });
  //   // 3. Insertar logo en la hoja (ej: A1)
  //   worksheet.addImage(logoId, {
  //     tl: { col: 0, row: 0 }, // Top-left: columna 0 (A), fila 0
  //     ext: { width: 160, height: 60 } // Set the width and height in pixels as needed
  //   });
  // }

  // Definir columnas
  const colsTotal = Object.keys(COLUMNS_DEFINITION);
  const localeVisibleColumns =
    options.visibleColumns && options.visibleColumns.length > 0
      ? colsTotal.filter(col => options.visibleColumns?.includes(col))
      : colsTotal;

  // Definir columnas
  worksheet.columns = localeVisibleColumns.map(colId => ({
    key: COLUMNS_DEFINITION[colId].key,
    header: COLUMNS_DEFINITION[colId].header,
    width: COLUMNS_DEFINITION[colId].width
  }));

  // Estilo para los encabezados que estan en la fila 1
  worksheet.getRow(1).eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colorView ? '7592cec3' : 'ffffffff' }
    };
    cell.font = {
      bold: true,
      color: { argb: colorView ? 'FFFFFFFF' : 'ff000000' }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
  });

  // Añadir datos
  clients.forEach((client, index) => {
    const bdcRep = `${client.bdc ? `${client.bdc.name || ''} ${client.bdc.last_name || ''}`.trim() : 'N/A'}`;
    const manager = `${
      client.sales_manager ? `${client.sales_manager.name || ''} ${client.sales_manager.last_name || ''}`.trim() : 'N/A'
    }`;

    // 2. Añadir filas para "Assigned To" (3 filas)
    // const rowStart = worksheet.rowCount + 1; // Fila inicial del cliente

    let oneRowObject: any = {};
    localeVisibleColumns.forEach(column => {
      const cell = COLUMNS_DEFINITION[column];
      if (cell && cell.render) {
        oneRowObject[cell.key] = cell.render(client, colorView);
      }
    });
    const row1 = worksheet.addRow(oneRowObject);

    // Segunda fila (BDC Rep) solo si se esta mostrando la columna assigned_to
    let row2 = undefined;
    let row3 = undefined;
    const assignedToBdcRichText = makeRichTextForAssignedTo('BDC Rep', bdcRep, colorView);
    if (localeVisibleColumns.includes('assigned_to')) {
      row2 = worksheet.addRow({ assignedTo: { richText: assignedToBdcRichText } });
      // Tercera fila (Manager)
      const assignedToManagerRichText = makeRichTextForAssignedTo('Manager', manager, colorView);
      row3 = worksheet.addRow({ assignedTo: { richText: assignedToManagerRichText } });
    }

    // fila de separación CON OTRO CLIENTE
    const row4 = worksheet.addRow({});

    const stripeColor = index % 2 === 0 ? 'ff46a58d' : '7592cec3';
    [row1, row2, row3, row4].forEach(row => {
      if (!row) return;
      row.fill = {
        type: 'pattern',
        pattern: colorView ? 'solid' : 'none',
        fgColor: { argb: colorView ? stripeColor : '' }
      };
      row.font = {
        color: { argb: colorView ? 'FFFFFFFF' : 'FF000000' }
      };
      row.alignment = { vertical: 'top', horizontal: 'left' };
    });

    // 5. Ajustar altura de filas (opcional)
    row1.height = 20;
    if (row2) row2.height = 20;
    if (row3) row3.height = 20;

    // // Estilo para celdas multilínea
    // row1.getCell('assignedTo').alignment = { wrapText: true, vertical: 'top' };

    // NAME font bold
    
    if (localeVisibleColumns.includes('customer_name')) {
      const cellName = row1.getCell('name');
      row1.getCell('name').font = { bold: true, color: { argb: colorView ? 'FFFFFFFF' : 'FF000000' } };
    }

    // Estilo condicional para Status
    // const statusText = statusCell.text.toLowerCase();
    if (localeVisibleColumns.includes('status')) {
      const statusCell = row1?.getCell('status');
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorView ? 'ffc9ebe6' : 'ffffff' } };
      statusCell.font = { color: { argb: colorView ? 'ff00a78b' : 'ff000000' }, bold: true, size: 14 };
    }
  });

  // Ajustar automáticamente el ancho de las columnas
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    if (typeof column.eachCell === 'function') {
      column.eachCell({ includeEmpty: true }, cell => {
        let columnLength = cell.text.length;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
    }
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
