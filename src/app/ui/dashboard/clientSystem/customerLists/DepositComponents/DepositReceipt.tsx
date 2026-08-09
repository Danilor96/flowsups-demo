// --- 2. Componente del Recibo (DepositReceipt) ---

import { useEffect, useRef } from 'react';

export interface DepositData {
  id: number;
  customerName: string;
  vehicleName?: string;
  amount: number;
  processingFee: number;
  total: number;
  method: string;
  reference?: string; // e.g., last 4 digits of card, check number
  depositDate: Date;
  goodThroughDate: Date;
  isNonRefundable: boolean;
  salesRep: string; // Added for more detail
  receiptNumber: string; // Added for more detail
  scannedDepositUrl?: string;
}

export interface DepositReceiptProps {
  deposit: DepositData;
  companyInfo: any; //CompanyInfo;
  onAfterPrint?: () => void;
}

export const DepositReceipt: React.FC<DepositReceiptProps> = ({ deposit, companyInfo, onAfterPrint }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  // Hook para manejar el evento afterprint
  useEffect(() => {
    const handleAfterPrint = () => {
      if (onAfterPrint) {
        onAfterPrint();
      }
    };

    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [onAfterPrint]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime()) || d.getTime() === 0) return '';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <div
        ref={receiptRef}
        id="printable-receipt-area"
        className="print-receipt-container p-8 pt-0 bg-white font-sans text-gray-800 w-full max-w-2xl mx-auto shadow-lg print:shadow-none print:p-0"
      >
        {/* Encabezado */}
        <header className="flex justify-between items-center pb-6 border-b-2 border-gray-200 bg-gray-300">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900">{companyInfo.name}</h1>
            {/* <p className="text-sm text-gray-500">{companyInfo.address}</p>
          <p className="text-sm text-gray-500">{companyInfo.phone}</p> */}
          </div>
          {/* {companyInfo.logoUrl && (
          <img src={'/'} alt={`${companyInfo.name} Logo`} className="h-16 w-auto" 
               onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
        )} */}
          {/* <div className="h-16 w-16 bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center hidden">No Logo</div> */}
        </header>
        {/* Título del Recibo y Detalles */}
        <section className="mt-8 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Deposit Receipt</h2>
            {deposit.reference && <p className="text-sm text-gray-500 mt-1">Reference: {deposit.reference}</p>}
          </div>
          <div className="text-right">
            <p className="font-semibold">Deposit Date:</p>
            <p className="text-gray-600">{formatDate(deposit.depositDate)}</p>
          </div>
        </section>
        {/* Información del Cliente y Vehículo */}
        <section className="mt-8 grid grid-cols-2 gap-8">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Customer</h3>
            <p className="text-lg font-semibold text-gray-900">{deposit.customerName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Vehicle</h3>
            <p className="text-lg font-semibold text-gray-900">{deposit.vehicleName}</p>
          </div>
        </section>
        {/* Desglose de Montos */}
        <section className="mt-8">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-sm font-semibold uppercase">Description</th>
                <th className="p-3 text-sm font-semibold uppercase text-right">amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">Deposit Amount</td>
                <td className="p-3 text-right">{formatCurrency(deposit.amount)}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Processing Fee</td>
                <td className="p-3 text-right">{formatCurrency(deposit.processingFee)}</td>
              </tr>
              <tr className="font-bold bg-gray-50 text-lg">
                <td className="p-4">Total</td>
                <td className="p-4 text-right">{formatCurrency(deposit.total)}</td>
              </tr>
            </tbody>
          </table>
        </section>
        {/* Detalles del Pago */}
        <section className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">PAYMENT METHOD</h3>
            <p className="text-md">{deposit.method}</p>
            {/* {deposit.reference && <p className="text-sm text-gray-500">Ref: {deposit.reference}</p>} */}
          </div>
          {/* <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Vendido por</h3>
          <p className="text-md">{deposit.salesRep}</p>
        </div> */}
        </section>
        {/* Cláusula y Fechas Importantes */}
        <section className="mt-8 p-4 border-2 rounded-lg ${deposit.isNonRefundable ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-lg ${deposit.isNonRefundable ? 'text-red-700' : 'text-green-700'}">
                {deposit.isNonRefundable ? 'Non-Refundable Deposit' : 'Refundable Deposit'}
              </p>
              {/* <p className="text-sm text-gray-600 mt-1">
              Este depósito asegura el vehículo hasta la fecha indicada.
            </p> */}
            </div>
            {formatDate(deposit.goodThroughDate) && (
              <div className="text-right">
                <p className="font-semibold">Through Date</p>
                <p className="text-lg font-bold text-gray-800">{formatDate(deposit.goodThroughDate)}</p>
              </div>
            )}
          </div>
        </section>
        {/* Pie de Página y Firma */}
        <footer className="mt-16 pt-8 border-t-2 border-dashed">
          <div className="grid grid-cols-2 gap-8 items-end">
            {/* <div>
             <p className="text-sm text-gray-600">Gracias por su negocio.</p>
             <p className="text-xs text-gray-400 mt-2">Por favor, guarde este recibo para sus archivos.</p>
          </div>
          <div className="border-t border-gray-400 pt-2">
            <p className="text-sm text-center text-gray-600">Firma del Cliente</p>
          </div> */}
          </div>
        </footer>
      </div>
      {/* Estilos globales para la impresión */}
      <style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 1cm;
          }
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100%;
          }

          body * {
            visibility: hidden;
          }
          #printable-receipt-area,
          #printable-receipt-area * {
            visibility: visible;
          }
          #printable-receipt-area {
            // position: absolute;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            padding: 0 !important;
          }
        }
      `}</style>
    </>
  );
};
