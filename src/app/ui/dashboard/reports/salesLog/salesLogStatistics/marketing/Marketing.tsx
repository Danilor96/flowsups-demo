import { useState } from 'react';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ColoredTable } from '&/table/coloredTable/ColoredTable';

export function Marketing() {
  // table data
  const [tableData, setTableDate] = useState<any[]>([
    {
      id: '',
      ad_id: '',
      sold: '',
      profit: '',
      per_unit: '',
      cpu: '',
      net_profit: '',
      nppu: '',
      status: '',
    },
  ]);

  // table totals data
  const [totalsData, setTotalsData] = useState<any[]>([
    {
      totals: 'Totals',
      sold: 0,
      profit: 0,
      per_unit: 0,
      cpu: 0,
      net_profit: 0,
      nppu: 0,
      status: 0,
    },
  ]);

  return (
    <ModalContent widthFull>
      <Paragraph fontSize={2.777778} fontWeight={600} color="#00A78B" marginBottom={1.666667}>
        Marketing
      </Paragraph>
      <ColoredTable
        height={67}
        textColor="#FFF"
        headTextCenter
        tableData={tableData}
        specialRow={totalsData}
      />
    </ModalContent>
  );
}
