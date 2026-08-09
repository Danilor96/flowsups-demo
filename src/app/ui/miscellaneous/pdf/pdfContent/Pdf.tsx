import { Document, Page, Text, StyleSheet, Image, View } from '@react-pdf/renderer';

const MAX_ROWS_PER_PAGE = 20;

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

export function Pdf({ data: pdfData, name, colorView = true }: { data?: PdfData; name: string, colorView?: boolean }) {

  if (!pdfData || !pdfData.body || pdfData.body.length === 0) return null;

  const pages = [];
  for (let i = 0; i < pdfData.body.length; i += MAX_ROWS_PER_PAGE) {
    pages.push(pdfData.body.slice(i, i + MAX_ROWS_PER_PAGE));
  }

  const totalColumns = pdfData.body[0]?.length || 
    (pdfData.headers[0] ? pdfData.headers[0].reduce((acc, cell) => acc + cell.colSpan, 0) : 1);

  const pageOrientation = totalColumns > 6 ? 'landscape' : 'portrait';

  const pageWidth = pageOrientation === 'landscape' ? 842 : 595;
  const pageHeight = pageOrientation === 'landscape' ? 595 : 842; 

  const baseRowHeightPt = (pageOrientation === 'landscape' ? 3.5 : 2) * (pageHeight / 100); // Convert vh to pt
  const headerHeightPt = baseRowHeightPt * (pdfData.maxDepth || 1);
  console.log('baseRowHeightPt: ', baseRowHeightPt);
  console.log('headerHeightPt: ', headerHeightPt);

  const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 1 * (pageWidth / 100),
    paddingVertical: 1 * (pageHeight / 100),

  },
  view: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3 * (pageHeight / 100),
  },
  table: {
    borderWidth: 0.1,
    borderColor: '#92CEC3',
    borderStyle: 'solid',
    borderRadius: 3.1, // Converted from 0.520833vw (approx 3.1pt for A4 portrait)
    overflow: 'hidden',
    // fontSize: 8,
  },
  body: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    color: '#FFF',
  },
});

  const headerCellsToRender : any[] = [];
  const grid = Array(pdfData.maxDepth).fill(0).map(() => Array(totalColumns).fill(null));

  console.log('headers: ', pdfData.headers)

  pdfData.headers.forEach((row, rowIndex) => {
    let currentGridCol = 0;
    row.forEach((cell) => {
      while (currentGridCol < totalColumns && grid[rowIndex][currentGridCol] !== null) {
        currentGridCol++;
      }

      if (currentGridCol >= totalColumns) {
        return;
      }

      if (cell.isPlaceholder) {
        for (let r = 0; r < cell.rowSpan; r++) {
          for (let c = 0; c < cell.colSpan; c++) {
            if (grid[rowIndex + r] && grid[rowIndex + r][currentGridCol + c] !== undefined) {
              grid[rowIndex + r][currentGridCol + c] = 'placeholder';
            }
          }
        }
        currentGridCol += cell.colSpan;
        return;
      }

      let cellWidthPercent;
      console.log('pdfData.columnWidths: ', pdfData.columnWidths)
      if (pdfData.columnWidths) {
        cellWidthPercent = pdfData.columnWidths.slice(currentGridCol, currentGridCol + cell.colSpan).reduce((a, b) => a + b, 0);
      } else {
        cellWidthPercent = (cell.colSpan / totalColumns) * 100;
      }

      let leftPercent;
      if (pdfData.columnWidths) {
        leftPercent = pdfData.columnWidths.slice(0, currentGridCol).reduce((a, b) => a + b, 0);
      } else {
        leftPercent = (currentGridCol / totalColumns) * 100;
      }

      headerCellsToRender.push({
        key: `${cell.id}-${rowIndex}-${currentGridCol}`,
        content: cell.content,
        style: {
          position: 'absolute',
          top: `${rowIndex * baseRowHeightPt}pt`,
          left: `${leftPercent}%`,
          width: `${cellWidthPercent}%`,
          // width: cell.id === 'rep' || cell.id === '1_rep_rep' ? `${cellWidthPercent*3}%` : `${cellWidthPercent}%`,
          height: `${headerHeightPt / pdfData.headers.length}pt`,
          
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          
          borderWidth: colorView ? 0.3 : 0.5,
          borderColor: colorView ? '#FFF' : '#000',
          borderStyle: 'solid',
          // backgroundColor: 'gray',
        }
      });

      for (let r = 0; r < cell.rowSpan; r++) {
        for (let c = 0; c < cell.colSpan; c++) {
          if (grid[rowIndex + r] && grid[rowIndex + r][currentGridCol + c] !== undefined) {
            grid[rowIndex + r][currentGridCol + c] = cell.id;
          }
        }
      }
      currentGridCol += cell.colSpan;
    });
  });

  console.log('cells headers: ', headerCellsToRender)

  return (
    <Document
      title={`${name.split(' ').join('_')}_${new Date().toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })}`}
    >
        {pages.map((pageData, pageIndex) => (
        <Page key={`${pageIndex}<${pageIndex + pageIndex}`} style={styles.page} orientation={pageOrientation} >
          {/*eslint-disable-next-line jsx-a11y/alt-text*/}
          <Image
            src="/flowsups.png"
            style={{
              width: (pageOrientation === 'landscape' ? 20 : 30) * (pageWidth / 100),
              height: 3 * (pageHeight / 100),
              marginBottom: 4 * (pageHeight / 100),
            }}
          />
          {/* table */}
          <View
            style={{
              ...styles.table,
              ...(colorView
                ? { borderWidth: 0.1 }
                : {
                    borderWidth: 1,
                    borderColor: '#000',
                  }),
            }}
          >
            {/* header */}
            <View
              style={{
                width: '100%',
                height: `${headerHeightPt}pt`,
                position: 'relative',
                fontSize: (pageOrientation === 'landscape' ? 1.4 : 1.1) * (pageHeight / 100),
                backgroundColor: colorView ? '#43B9A5' : '#FFF',
                color: colorView ? '#FFF' : '#000',
                borderBottomWidth: colorView ? 0.1 : 1,
                borderBottomColor: '#000',
                borderBottomStyle: 'solid',
              }}
            >
              {headerCellsToRender.map(cell => (
                <View key={cell.key} style={cell.style}>
                  <Text style={{ fontWeight: 600 }}>
                    {cell.content}
                  </Text>
                </View>
              ))}
            </View>
            {/* body */}
            <View style={{...styles.body, color: colorView ? '#FFF' : '#000' }}>
              {pageData.map((row, index) => (
                  <View
                    key={index}
                    style={{
                      height: (pageOrientation === 'landscape' ? 3.5 : 2) * (pageHeight / 100),
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      fontSize: (pageOrientation === 'landscape' ? 1.2 : 0.8) * (pageHeight / 100),
                      backgroundColor: index % 2 ? (colorView ? '#43B9A5' : '#FFF') : colorView ? '#00A78B' : '#FFF',
                      borderBottomWidth: colorView ? 0.1 : 1,
                      borderBottomColor: '#000',
                      borderBottomStyle: 'solid',
                    }}
                  >
                    {row.map((cell, cellIndex) => {
                      const cellWidth = pdfData.columnWidths ? pdfData.columnWidths[cellIndex] : (100 / totalColumns);
                      return (
                        <View
                          key={`${cellIndex}/${cellIndex * cellIndex}`}
                          style={{
                            width: `${cellWidth}%`,
                            display: 'flex',
                            justifyContent: 'center',
                            textAlign: 'center',
                            paddingHorizontal: 0.5 * (pageWidth / 100),
                          }}
                        >
                          <Text>{cell}</Text>
                        </View>
                      );
                    })}
                  </View>
                ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}
