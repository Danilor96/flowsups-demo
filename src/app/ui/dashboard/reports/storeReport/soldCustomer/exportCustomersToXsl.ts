import { ClientType, InterestedVehicle } from '@/app/libs/definitions';
import ExcelJS, { Row } from 'exceljs';
import { daysOld } from '../../../clientSystem/customerLists/utils/utils';

function makeRichTextLabelValue(label: string, value: string, colorView: boolean = true) {
  return [
    { text: `${label}: `, font: { bold: true, color: { argb: colorView ? 'ffffff' : 'ff000000' } } },
    { text: value, font: { bold: false, color: { argb: colorView ? 'ffffff' : 'ff000000' } } }
  ];
}

function textLabelValueCell(label: string, value: string, colorView: boolean = true) {
  return {
    richText: makeRichTextLabelValue(label, value, colorView)
  } 
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
  if (!phone) return '';
  const customerContactArray = phone?.split('');
  const customerContactFormatted = `${customerContactArray?.slice(0, 3).join('')}-${customerContactArray
    ?.slice(3, 6)
    .join('')}-${customerContactArray?.slice(6, 10).join('')}`;
  return customerContactFormatted;
};

const formatVehicle = (vehicle: InterestedVehicle) => {
  if (!vehicle) return '';

  const year = vehicle?.vehicle_manufacture_years?.year || '';
  const brand = vehicle?.vehicle_brands.brand.toUpperCase() || '';
  const model = vehicle?.vehicle_models.model || '';
  const vin = vehicle?.vehicle_identification_numbers.vin || '';
  const lastSixVin = vin?.slice(vin.length - 6, vin.length) || '';
  return `${year} ${brand} ${model} [${lastSixVin}]`;
};

const formatDate = (date: Date | null | undefined) => {
  if (!date) return '';

  const newDateFormat: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  return new Date(date).toLocaleString('en-US', newDateFormat);
};

const getDealInfo = (el: ClientType) => {
  const dealInfo = el.deal.length > 0 ? el.deal[el.deal.length - 1] : null;
  const bank = dealInfo ? dealInfo.bank?.bank : ' ';
  const downPayment = dealInfo ? dealInfo.downpayment : '0';
  const paid = dealInfo ? dealInfo.paid : '';
  const deferredMoney = dealInfo ? dealInfo.deferredDownpayment[0] : '0';
  const frontend = dealInfo ? dealInfo.frontend : '0';
  const backend = dealInfo ? dealInfo.backend : '0';
  const totalProfit = dealInfo ? dealInfo.totalProfit : '0';
  const bonus = dealInfo ? dealInfo.bonus : '0';
  const totalDeferredDownpayment =
    parseFloat(downPayment.replaceAll(',', '')) -
    parseFloat(paid.replaceAll(',', '')) -
    parseFloat(bonus.replaceAll(',', ''));

  return {
    bank,
    downPayment,
    paid,
    deferredMoney,
    frontend,
    backend,
    totalProfit,
    bonus,
    totalDeferredDownpayment,
  };
};

interface CustomRow {
  key: string;
  render: (client: ClientType, colorView?: boolean) => string | { richText: any };
}

interface CellDefinitionType {
  [key: string]: {
    header: string;
    key: string;
    width: number;
    render?: (client: ClientType, colorView?: boolean) => string | { richText: any };
    rows?: CustomRow[];
  };
}

const CELL_DEFINITION: CellDefinitionType = {
  customer: {
    header: 'Customer',
    key: 'name',
    width: 20,
    rows: [
      {
        key: 'name_customer',
        render: (client: ClientType, colorView) => `${client.first_name || ''} ${client.last_name || ''}`,
      },
      {
        key: 'phone_customer',
        render: (client: ClientType, colorView) => {
          const phone = formatPhone(client.mobile_phone);
          return textLabelValueCell('Cell Phone', phone, colorView);
        },
      },
      {
        key: 'home_phone',
        render: (client: ClientType, colorView) => {
          const homePhone = formatPhone(client.home_phone);
          return textLabelValueCell('Home Phone', homePhone, colorView);
        },
      },
      {
        key: 'email',
        render: (client: ClientType, colorView) => {
          const email = client.email || '';
          return textLabelValueCell('Email', email, colorView);
        },
      },
    ],
  },
  vehicle_sold: {
    header: 'Vehicle Sold',
    key: 'vehicle',
    width: 20,
    render: (client: ClientType) => formatVehicle(client.interested_vehicle),
  },
  lead_info: {
    header: 'Lead Info',
    key: 'lead_info',
    width: 20,
    rows: [
      {
        key: 'sales_rep',
        render: (client: ClientType, colorView) => {
          const salesRep = `${
            client.seller ? `${client.seller.name || ''} ${client.seller.last_name || ''}`.trim() : ''
          }`;
          const assignedToSalesRichText = makeRichTextLabelValue('Sales Rep', salesRep, colorView);
          return { richText: assignedToSalesRichText };
        },
      },
      {
        key: 'bdc_rep',
        render: (client: ClientType, colorView) => {
          const bdcRep = `${client.bdc ? `${client.bdc.name || ''} ${client.bdc.last_name || ''}`.trim() : ''}`;
          const assignedToBdcRichText = makeRichTextLabelValue('BDC Rep', bdcRep, colorView);
          return { richText: assignedToBdcRichText };
        },
      },
      {
        key: 'sales_manager',
        render: (client: ClientType, colorView) => {
          const salesManager = `${
            client.sales_manager
              ? `${client.sales_manager.name || ''} ${client.sales_manager.last_name || ''}`.trim()
              : ''
          }`;
          const assignedToSalesManagerRichText = makeRichTextLabelValue('Sales Manager', salesManager, colorView);
          return { richText: assignedToSalesManagerRichText };
        },
      },
      {
        key: 'finance_manager',
        render: (client: ClientType, colorView) => {
          const financeManager = `${
            client.finance_manager
              ? `${client.finance_manager.name || ''} ${client.finance_manager.last_name || ''}`.trim()
              : ''
          }`;
          const assignedToFinanceManagerRichText = makeRichTextLabelValue('Finance Rep', financeManager, colorView);
          return { richText: assignedToFinanceManagerRichText };
        },
      },
      {
        key: 'source',
        render: (client: ClientType, colorView) =>
          textLabelValueCell('Source', client.lead_source?.source || '', colorView),
      },
    ],
  },
  date: {
    header: 'Date',
    key: 'date',
    width: 20,
    rows: [
      {
        key: 'created_date',
        render: (client: ClientType, colorView) => textLabelValueCell('Created', formatDate(client.created_at), colorView),
      },
      {
        key: 'sales_assigned_date',
        render: (client: ClientType, colorView) =>
          textLabelValueCell('Sales Rep', formatDate(client.last_activity), colorView),
      },
      {
        key: 'sold_date',
        render: (client: ClientType, colorView) =>
          textLabelValueCell('Sold', formatDate(client.client_status_changed_at), colorView),
      },
      {
        key: 'delivered_date',
        render: (client: ClientType, colorView) => {
          if (!client.vehicle_delivery || client.vehicle_delivery.length === 0)
            return textLabelValueCell('Delivered', '', colorView);
          return textLabelValueCell(
            'Delivered',
            formatDate(client.vehicle_delivery[client.vehicle_delivery.length - 1].start_date),
            colorView,
          );
        },
      },
      {
        key: 'vehicle_days_old',
        render: (client: ClientType, colorView) => {
          const vehicleDaysOld =
            client.interested_vehicle && client.interested_vehicle.entry_stock
              ? daysOld(client.interested_vehicle.entry_stock)
              : '';
          return textLabelValueCell('Vehicle Days Old', vehicleDaysOld, colorView);
        },
      },
    ],
  },
  deal_info: {
    header: 'Deal Info',
    key: 'deal_info',
    width: 20,
    rows: [
      {
        key: 'frontend',
        render: (client: ClientType, colorView) => {
          const { frontend } = getDealInfo(client);
          return textLabelValueCell('Frontend', frontend, colorView);
        },
      },
      {
        key: 'backend',
        render: (client: ClientType, colorView) => {
          const { backend } = getDealInfo(client);
          return textLabelValueCell('Backend', backend, colorView);
        },
      },
      {
        key: 'total_profit',
        render: (client: ClientType, colorView) => {
          const { totalProfit } = getDealInfo(client);
          return textLabelValueCell('Total', totalProfit, colorView);
        },
      },
      {
        key: 'lender',
        render: (client: ClientType, colorView) => {
          const { bank } = getDealInfo(client);
          return textLabelValueCell('Lender', bank || '', colorView);
        },
      },
    ],
  },
  _blank_deal_info: {
    header: '',
    key: '_blank_deal_info',
    width: 20,
    rows: [
      {
        key: 'money_donw',
        render: (client: ClientType, colorView) => {
          const { paid } = getDealInfo(client);
          return textLabelValueCell('Money Down', paid, colorView);
        },
      },
      {
        key: 'deferred_money',
        render: (client: ClientType, colorView) => {
          const { deferredMoney } = getDealInfo(client);
          return textLabelValueCell('Deferred', deferredMoney, colorView);
        },
      },
      {
        key : 'bonus',
        render: (client: ClientType, colorView) => {
          const { bonus } = getDealInfo(client);
          return textLabelValueCell('Bonus', bonus, colorView);
        }
      },
      {
        key: 'down_payment',
        render: (client: ClientType, colorView) => {
          const { downPayment } = getDealInfo(client);
          return textLabelValueCell('Down Payment', downPayment, colorView);
        }
      }
    ],
  },
};

interface options {
  returnBlob?: boolean;
  visibleColumns?: string[];
}

export async function exportClientsToExcelV2(
  clients: ClientType[],
  fileName = 'sold-list.xlsx',
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
  const colsTotal = Object.keys(CELL_DEFINITION);
  const localeVisibleColumns = colsTotal;
    // options.visibleColumns && options.visibleColumns.length > 0
    //   ? colsTotal.filter(col => options.visibleColumns?.includes(col))
    //   : colsTotal;

  // Definir columnas
  worksheet.columns = localeVisibleColumns.map(colId => ({
    key: CELL_DEFINITION[colId].key,
    header: CELL_DEFINITION[colId].header,
    width: CELL_DEFINITION[colId].width
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
    // 2. Añadir filas para "Assigned To" (3 filas)
    // const rowStart = worksheet.rowCount + 1; // Fila inicial del cliente

    let oneRowObject: any = {};
    // localeVisibleColumns.forEach(column => {
    //   const cell = COLUMNS_DEFINITION[column];
    //   if (cell && cell.render) {
    //     oneRowObject[cell.key] = cell.render(client, colorView);
    //   }
    // });
    const stripeColor = index % 2 === 0 ? 'FF00A78B' : 'FF43B9A5';

    const excelRowsCreated: Row[] = [];
    const cantidad_de_filas = 5;
    for (let currentRow = 0; currentRow < cantidad_de_filas; currentRow++) {
      const rowObject: any = {};
      localeVisibleColumns.forEach(column => {
        const cell = CELL_DEFINITION[column];
        if (cell && cell.render && !cell.rows) {
          if (currentRow > 0) {
            rowObject[cell.key] = '';
          } else {
            rowObject[cell.key] = cell.render(client, colorView);
          }
        }
        if (cell && !cell.render && cell.rows) {
          const rowRender = cell.rows[currentRow]
            ? cell.rows[currentRow].render
            : (client: ClientType, colorView: boolean) => '';
          rowObject[cell.key] = rowRender(client, colorView);
        }
      });

      excelRowsCreated.push(rowObject);
      const newRowExcel = worksheet.addRow(rowObject);
      // console.log(rowObject);
      newRowExcel.eachCell(cellEx => {
        cellEx.fill = {
          type: 'pattern',
          pattern: colorView ? 'solid' : 'none',
          fgColor: { argb: colorView ? stripeColor : '' },
        };
        cellEx.font = {
          color: { argb: colorView ? 'FFFFFFFF' : 'FF000000' },
        };
        cellEx.alignment = { vertical: 'top', horizontal: 'left' };
      });
    }

    // fila de separación CON OTRO CLIENTE
    const row5 = worksheet.addRow({});
    for (let currentColumn = 0; currentColumn < localeVisibleColumns.length; currentColumn++) {
      const cellLastEx = row5.getCell(currentColumn+1);
      cellLastEx.fill = {
        type: 'pattern',
        pattern: colorView ? 'solid' : 'none',
        fgColor: { argb: colorView ? stripeColor : '' },
      };
      cellLastEx.font = {
        color: { argb: colorView ? 'FFFFFFFF' : 'FF000000' },
      };
      cellLastEx.alignment = { vertical: 'top', horizontal: 'left' };
    }

    // const assignedToBdcRichText = makeRichTextLabelValue('BDC Rep', 'ssss', colorView);
    // // if (localeVisibleColumns.includes('assigned_to')) {
    //   row2 = worksheet.addRow({ assignedTo: { richText: assignedToBdcRichText } });
    //   // Tercera fila (Manager)
    //   const assignedToManagerRichText = makeRichTextLabelValue('Manager','ssss', colorView);
    //   row3 = worksheet.addRow({ assignedTo: { richText: assignedToManagerRichText } });
    // // }

    // row1 = worksheet.addRow(oneRowObject);

    // 5. Ajustar altura de filas (opcional)
    // row1.height = 20;
    // if (row2) row2.height = 20;
    // if (row3) row3.height = 20;

    // // Estilo para celdas multilínea
    // row1.getCell('assignedTo').alignment = { wrapText: true, vertical: 'top' };

    // NAME font bold

    // if (localeVisibleColumns.includes('customer_name')) {
    //   const cellName = row1.getCell('name');
    //   row1.getCell('name').font = { bold: true, color: { argb: colorView ? 'FFFFFFFF' : 'FF000000' } };
    // }

    // Estilo condicional para Status
    // const statusText = statusCell.text.toLowerCase();
    // if (localeVisibleColumns.includes('status')) {
    //   const statusCell = row1?.getCell('status');
    //   statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorView ? 'ffc9ebe6' : 'ffffff' } };
    //   statusCell.font = { color: { argb: colorView ? 'ff00a78b' : 'ff000000' }, bold: true, size: 14 };
    // }
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
