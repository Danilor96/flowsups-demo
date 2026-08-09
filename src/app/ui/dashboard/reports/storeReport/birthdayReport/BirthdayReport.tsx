import { useEffect, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { ReportsFilter } from '&/miscellaneous/reportsFilter/ReportsFilter';
import { storeReportsStore } from '@/store/reports';
import { DateFormats } from '@/app/ui/miscellaneous/dateFormats/DateFormats';
import { CustomerName } from '@/app/ui/miscellaneous/customerName/CustomerName';
import { CustomerContactFormat } from '@/app/ui/miscellaneous/customerContactFormat/CustomerContactFormat';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';

export function BirthdayReport({ closeWindow }: CloseWindow) {
  // ----- global states -----

  const { birthdayReport } = storeReportsStore();
  const { getBirthdayReport } = storeReportsStore();

  useEffect(() => {
    setLoading(true);
    getBirthdayReport().finally(() => setLoading(false));
  }, [getBirthdayReport]);

  // ----- local states -----
  const [loading, setLoading ] = useState(true);

  // table data
  const [tableData, setTableData] = useState<any[]>([
    {
      id: '',
      birthday_date: '',
      birth_month: '',
      signer_dob: '',
      firts_name: '',
      last_name: '',
      last_4_ssn: '',
      city: '',
      last_contact_date: '',
      customer_stage: '',
      customer_status: '',
      home_phone: '',
      work_phone: '',
      mobile: '',
      created_date: '',
      created_by_name: '',
      contact_time: '',
      signer_dl_number: '',
      email: '',
    },
  ]);

  const initialColumnsDef = { 
    birthday_date: true,
    birth_month: true,
    signer_dob: true,
    firts_name: true,
    last_name: true,
    last_4_ssn: true,
    city: true,
    last_contact_date: true,
    customer_stage: true,
    customer_status: true,
    home_phone: true,
    work_phone: true,
    mobile: true,
    created_date: true,
    created_by_name: true,
    contact_time: true,
    signer_dl_number: true,
    email: true,
  };

  const { columns } = useDynamicTableColumns({
    initialColumnsDef,
    excludeKeys: ['id'],
  });

  useEffect(() => {
    if (birthdayReport && birthdayReport.length > 0) {
      const newTableData: any[] = [];

      birthdayReport.forEach((el) => {
        newTableData.push({
          id: el.id,
          birthday_date: <DateFormats date={el.born_date} format={2} />,
          birth_month: <DateFormats date={el.born_date} format={4} />,
          signer_dob: '',
          firts_name: el.first_name,
          last_name: el.last_name,
          last_4_ssn: el.social_security.slice(-4),
          city: el.client_address?.city || '',
          last_contact_date: <DateFormats date={el.last_activity} format={2} />,
          customer_stage: '',
          customer_status: el.client_status.status,
          home_phone: <CustomerContactFormat contact={el.home_phone} noIcon />,
          work_phone: <CustomerContactFormat contact={el.work_phone} noIcon />,
          mobile: <CustomerContactFormat contact={el.mobile_phone} noIcon />,
          created_date: <DateFormats date={el.created_at} format={2} />,
          created_by_name: '',
          contact_time: <DateFormats date={el.contact_time} format={2} />,
          signer_dl_number: '',
          email: el.email,
        });
      });

      newTableData && newTableData.length > 0 && setTableData(newTableData);
    }
  }, [birthdayReport]);

  // handling close current window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  // handling buttons
  const handleButtons = (e: React.MouseEvent<HTMLButtonElement>) => {};

  // handling search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {};

  return (
    <ModalWindow top={0}>
      <ModalContainer width={97.395833} marginTop={1.759259}>
        <ModalContainerTitle title="Birthday Report" closeWindowFunction={handleCloseWindow} />
        <ModalContent>
          <ButtonContainer marginTop={0} marginBottom={2.5} widthFull justify="space-between" alignContentCenter>
            <ReportsFilter onClick={handleButtons} onChange={handleSearch} />
            <div>
              <Button
                backgroundColor="#00A78B"
                height={5.462963}
                width={6.5625}
                identity="reset"
                textColor="#FFF"
                buttonText="Reset"
                onClick={handleButtons}
              />
            </div>
          </ButtonContainer>
          <ColoredTableV2
            data={tableData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={12}
            paginationIsActive
            textColor="#FFF"
            height={63.2}
            rowSelectionIsActive={false}
            printButtonIsActive
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
