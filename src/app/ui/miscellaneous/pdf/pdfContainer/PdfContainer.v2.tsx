import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { Text, StyleSheet, Document, Page, usePDF, pdf } from '@react-pdf/renderer';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ClientPdfTable } from '@/app/ui/dashboard/clientSystem/customerList/generateTablePdf';
import { useState, useEffect } from 'react';
import { Input } from '@/app/ui/inputs/Input';
import { exportClientsToExcelV2 } from '@/app/ui/dashboard/clientSystem/customerList/exportCustomersToXsl';
import { Button } from '@/app/ui/buttons/Button';
import { ListViewTypes } from '@/store/customerList/types';

const styles = StyleSheet.create({
  viewer: {
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: '#f8fafc',
  },
});

interface props {
  handleCloseWindow: () => void;
  dataTable: any[] | undefined;
  viewType?: 'list' | 'detail';
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
  visibleColumns: string[];
}

const LoadingIndicator = ({ message = 'PREPARING PDF' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center h-full w-full gap-6 bg-white absolute inset-0 z-10">
    <div className="relative">
      <div className="w-14 h-14 border-4 border-[#92CEC3]/30 border-t-[#00A78B] rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 bg-[#00A78B] rounded-full opacity-10 animate-pulse"></div>
      </div>
    </div>
    <div className="text-center animate-pulse">
      <h3 className="text-lg font-bold text-[#00A78B]">{message}</h3>
      {/* <p className="text-gray-400 text-[10px] tracking-widest mt-1 uppercase font-semibold">Please wait a moment</p> */}
    </div>
    <style jsx>{`
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      .animate-spin {
        animation: spin 0.8s linear infinite;
      }
    `}</style>
  </div>
);

const ButtonSpinner = () => (
  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2">
    <style jsx>{`
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      .animate-spin {
        animation: spin 0.6s linear infinite;
      }
    `}</style>
  </div>
);

// Minimal document to avoid initialization errors
const InitialDoc = (
  <Document>
    <Page size="A4">
      <Text> </Text>
    </Page>
  </Document>
);

export const PdfContainerForCustomer = ({
  handleCloseWindow,
  dataTable,
  viewType = 'list',
  pagination,
  visibleColumns,
}: props) => {
  const [viewTypeValue, setViewTypeValue] = useState(viewType);
  const [exportTo, setExportTo] = useState('PDF');
  const [printFrom, setPrintFrom] = useState('All');
  const [colorView, setColorView] = useState(true);

  // Transition states
  const [isModalReady, setIsModalReady] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<JSX.Element>(InitialDoc);
  const [generationKey, setGenerationKey] = useState(0);
  const [isExportingFull, setIsExportingFull] = useState(false);

  const handleViewTypeChange = (e: any) => {
    const selectedValue = e.target.value;
    setViewTypeValue(selectedValue === '1' ? 'list' : 'detail');
    setGenerationKey(prev => prev + 1);
  };

  // 1. Wait for modal animation to finish before starting EVERYTHING
  useEffect(() => {
    const timer = setTimeout(() => setIsModalReady(true), 400); // Wait for AnimatePresence
    return () => clearTimeout(timer);
  }, []);

  // 2. Generate the PREVIEW document JSX ONLY (Max 5 pages)
  useEffect(() => {
    if (!isModalReady || !dataTable?.length) return;

    // Optimization: Preview only first 35 items (approx 5 pages) if set to "All"
    const MAX_PREVIEW_ITEMS = 35;
    let previewData = dataTable;

    if (printFrom === 'All') {
      previewData = dataTable.slice(0, MAX_PREVIEW_ITEMS);
    } else {
      previewData = dataTable.slice(
        (pagination.currentPage - 1) * pagination.itemsPerPage,
        pagination.currentPage * pagination.itemsPerPage,
      );
    }

    const doc = (
      <ClientPdfTable
        clients={previewData}
        name={`${viewTypeValue === 'list' ? 'customer-list-preview' : 'customer-detail-preview'}`}
        colorView={colorView}
        visibleColumnIds={visibleColumns}
        viewType={viewTypeValue === 'list' ? ListViewTypes.ListView : ListViewTypes.DetailView}
      />
    );

    setCurrentDoc(doc);
  }, [isModalReady, dataTable, viewTypeValue, printFrom, colorView, visibleColumns, pagination]);

  const [instance, updateInstance] = usePDF({ document: currentDoc });

  useEffect(() => {
    if (isModalReady && currentDoc !== InitialDoc) {
      updateInstance(currentDoc);
    }
  }, [currentDoc, isModalReady, updateInstance]);

  const printPDF = () => instance.url && window.open(instance.url);

  const handleExport = async () => {
    const clientsToExport =
      printFrom === 'All'
        ? dataTable
        : dataTable?.slice(
            (pagination.currentPage - 1) * pagination.itemsPerPage,
            pagination.currentPage * pagination.itemsPerPage,
          );

    if (exportTo === 'XLS') {
      return exportClientsToExcelV2(clientsToExport || [], `report-${Date.now()}.xlsx`, colorView, { visibleColumns });
    }

    // Handle FULL PDF Download
    // 1. Set loading state FIRST to show Spinner
    setIsExportingFull(true);

    // 2. Use a delay to let the browser PAINT the spinner before the CPU-heavy generation blocks the thread
    setTimeout(async () => {
      try {
        const fullDoc = (
          <ClientPdfTable
            clients={clientsToExport || []}
            name={`${viewTypeValue === 'list' ? 'customer-list' : 'customer-detail'}`}
            colorView={colorView}
            visibleColumnIds={visibleColumns}
            viewType={viewTypeValue === 'list' ? ListViewTypes.ListView : ListViewTypes.DetailView}
          />
        );

        const blob = await pdf(fullDoc).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-${Date.now()}.pdf`;
        link.click();

        // Cleanup
        setTimeout(() => URL.revokeObjectURL(url), 100);
      } catch (error) {
        console.error('Error generating full PDF:', error);
      } finally {
        setIsExportingFull(false);
      }
    }, 150); // Small margin to ensure UI thread update
  };

  const isActuallyLoading = !isModalReady || instance.loading || currentDoc === InitialDoc;

  return (
    <ModalWindow top={-13.8}>
      <ModalContainer marginTop={2} width={98}>
        <ModalContainerTitle title="Customer Report Print" closeWindowFunction={handleCloseWindow} />
        <ModalContent overflowVisible height={88}>
          <div className="flex h-full w-full rounded-lg bg-white overflow-hidden shadow-xl border border-gray-100">
            {/* Sidebar */}
            <section className="w-[20%] h-full flex flex-col bg-gray-50/50 border-r border-gray-100 p-6">
              <div className="flex flex-col gap-6 h-full">
                <Input
                  type="select"
                  value={printFrom === 'All' ? '1' : '2'}
                  onChange={e => {
                    setPrintFrom(e.target.value === '1' ? 'All' : 'currentPage');
                    setGenerationKey(prev => prev + 1);
                  }}
                  options={[
                    { value: 1, option: 'All Results' },
                    { value: 2, option: 'Current Page' },
                  ]}
                  label="Data Scope"
                  name="printFrom"
                  width={10}
                />

                <Input
                  type="select"
                  value={viewTypeValue === 'list' ? '1' : '2'}
                  onChange={handleViewTypeChange}
                  options={[
                    { value: 1, option: 'List View' },
                    { value: 2, option: 'Detail View' },
                  ]}
                  label="Display Level"
                  name="viewType"
                  width={10}
                />

                <Input
                  type="select"
                  value={colorView ? '1' : '2'}
                  onChange={e => {
                    setColorView(e.target.value === '1');
                    setGenerationKey(prev => prev + 1);
                  }}
                  options={[
                    { value: 1, option: 'Flowsups Palette' },
                    { value: 2, option: 'Gray Scale' },
                  ]}
                  label="Color Mode"
                  name="colorView"
                  width={10}
                />

                <Input
                  type="select"
                  value={exportTo === 'PDF' ? '1' : '2'}
                  onChange={e => setExportTo(e.target.value === '1' ? 'PDF' : 'XLS')}
                  options={[
                    { value: 1, option: 'PDF (.pdf)' },
                    { value: 2, option: 'Excel (.xlsx)' },
                  ]}
                  label="Export Format"
                  name="exportAs"
                  width={10}
                />

                <div className="mt-auto flex flex-col gap-3">
                  <div className="text-[10px] bg-amber-50 text-amber-700 px-3 py-2 rounded-md mb-2 border border-amber-100">
                    <strong>Preview Mode:</strong> Only first 5 pages are shown here. Download to get the full report.
                  </div>
                  {/* <Button
                    onClick={printPDF}
                    width={10}
                    buttonText="Open Preview"
                    borderColor="#00A78B"
                    backgroundColor="transparent"
                    textColor="#00A78B"
                    border={0.104167}
                    identity='openPreview'
                    disabled={isActuallyLoading || isExportingFull}
                  /> */}
                  <Button
                    onClick={handleExport}
                    width={10}
                    buttonText={isExportingFull ? 'Generating...' : 'Download Full'}
                    backgroundColor="#00A78B"
                    textColor="#FFF"
                    border={0.104167}
                    borderColor="#00A78B"
                    identity="download"
                    disabled={isActuallyLoading || isExportingFull}
                  >
                    {isExportingFull && <ButtonSpinner />}
                  </Button>
                  {(isActuallyLoading || isExportingFull) && exportTo === 'PDF' && (
                    <div className="text-[9px] text-start font-bold text-[#00A78B] animate-pulse">
                      {isExportingFull ? 'BUILDING FULL REPORT...' : 'BUILDING PREVIEW...'}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Viewer Area */}
            <main className="w-[80%] h-full bg-gray-100 relative shadow-inner">
              {isActuallyLoading ? (
                <LoadingIndicator message="LOADING PREVIEW..." />
              ) : (
                <div className="w-full h-full animate-in fade-in duration-500">
                  <iframe
                    key={generationKey}
                    src={instance.url || ''}
                    className="w-full h-full border-none shadow-2xl"
                    title="PDF Viewer"
                  />
                </div>
              )}
            </main>
          </div>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
};
