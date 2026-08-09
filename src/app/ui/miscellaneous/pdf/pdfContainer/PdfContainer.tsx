import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { Document, Page, pdf, PDFViewer, StyleSheet, Text } from '@react-pdf/renderer';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { modalWindowStore } from '@/store/adminDashboard';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { pdfDataStore } from '@/store/pdfData';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { Pdf } from '&/miscellaneous/pdf/pdfContent/Pdf';
import { useMemo, useState } from 'react';
import { Input } from '@/app/ui/inputs/Input';
import { Button } from '@/app/ui/buttons/Button';
import { exportDataToXls } from '../exportDataToXsl';

const styles = StyleSheet.create({
  viewer: {
    width: '100%',
    height: '100%'
  }
});

export default function PdfContainer() {
  // ----- global states -----

  const { openClosePrintingData } = modalWindowStore();

  const { pdfData, pdfName } = pdfDataStore();

  // ----- local states -----
  const [exportTo, setExportTo] = useState('PDF');
  const [printFrom, setPrintFrom] = useState('All');
  const [colorView, setColorView] = useState(true);

  const handleCloseWindow = () => {
    openClosePrintingData();
  };

  const PdfDocument = useMemo(() => {
    if (!pdfData || pdfData.length === 0) {
      return (
        <Document>
          <Page size="A4">
            <Text>No data available</Text>
          </Page>
        </Document>
      );
    }

    return <Pdf data={pdfData as any} name={pdfName} colorView={colorView} />;
  }, [pdfData, pdfName, colorView]);

  const savePDF = async () => {
    const blob = await pdf(PdfDocument).toBlob();
    const file = new Blob([blob], { type: 'application/pdf' });
    const url = URL.createObjectURL(file);

    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `customer-list-${Date.now().toString()}.pdf`;
    link.click();
  };

  const printPDF = async () => {
    const blob = await pdf(PdfDocument).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url); // Abre el PDF en una nueva pestaña
  };

  const handleExport = () => {
    const visibleColumns : string[] = [];
    const dataToExport =
      printFrom === 'All'
        ? pdfData
        : pdfData
    if (exportTo === 'XLS' && dataToExport) {
      return exportDataToXls(dataToExport as any, `list-${Date.now().toString()}.xlsx`, colorView, {
        visibleColumns: visibleColumns
      });
    }
    if (exportTo === 'PDF' && PdfDocument) {
      savePDF();
    }
  };

  return (
    <ModalWindow top={-13.8} zIndex={60}>
      <ModalContainer marginTop={2} width={98}>
        <ModalContainerTitle title="Print" closeWindowFunction={handleCloseWindow} />
        <ModalContent overflowVisible height={87}>
          <div className="flex h-full w-full rounded-md">
            <section className="w-[20%] h-[100%] pr-7 flex flex-col bg-[white] border-r-2 border-[#E0E0E0]">
              <div className="flex flex-col pt-4 h-full gap-4">
                <div className="flex flex-col gap-2">
                  {/* <Input
                    type="select"
                    value={printFrom === 'All' ? '1' : '2'}
                    onChange={e => (e.target.value === '1' ? setPrintFrom('All') : setPrintFrom('currentPage'))}
                    options={[
                      { value: 1, option: 'All' },
                      { value: 2, option: 'This Page' }
                    ]}
                    label="Page"
                    name="printFrom"
                    width={10}
                  />
                  <span className="text-[1.396296vh] text-[#959595] font-light leading-[1.805556.vh]">
                    Page {`${printFrom === 'currentPage' ? pagination.currentPage : `1 - ${pagination.totalPages}`}`}
                  </span> */}
                </div>
                <Input
                  type="select"
                  value={colorView ? '1' : '2'}
                  onChange={e => setColorView(e.target.value === '1')}
                  options={[
                    { value: 1, option: 'flowsups colors' },
                    { value: 2, option: 'Black and white' }
                  ]}
                  label="Color"
                  name="colorView"
                  width={10}
                />
                <Input
                  type="select"
                  value={exportTo === 'PDF' ? '1' : '2'}
                  onChange={e => setExportTo(e.target.value === '1' ? 'PDF' : 'XLS')}
                  options={[
                    { value: 1, option: 'PDF' },
                    { value: 2, option: 'XLS' }
                  ]}
                  label="Export as"
                  name="exportAs"
                  width={10}
                />
              </div>
              <div className="flex gap-3 justify-center items-center">
                <Button
                  onClick={() => printPDF()}
                  width={8}
                  buttonText="Print"
                  borderColor="#00A78B"
                  backgroundColor=""
                  textColor="#00A78B"
                  border={0.104167}
                  identity="cancelarExportTo"
                />
                <Button
                  onClick={() => handleExport()}
                  width={8}
                  buttonText="Export"
                  backgroundColor="#00A78B"
                  textColor="#FFF"
                  border={0.104167}
                  identity="c-listExportTo"
                  borderColor="#00A78B"
                />
              </div>
            </section>
            <div className="w-[80%] h-[100%]">
              <PDFViewer style={styles.viewer} showToolbar={true}>
                {PdfDocument}
              </PDFViewer>
            </div>
          </div>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
