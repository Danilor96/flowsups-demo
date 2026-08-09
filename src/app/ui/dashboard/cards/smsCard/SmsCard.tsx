import { useEffect, useState } from 'react';
import 'react-day-picker/dist/style.css';
import {
  clientMessagesStore,
  currentSectionStore,
  messagesStore,
  modalWindowStore,
} from '@/store/adminDashboard';
import { Slide } from '&/slide/Slide';
import { SmsFilter } from '&/dashboard/cards/smsCard/smsFilter/SmsFilter';
import { DateRange } from 'react-day-picker';
import { dateFormatsStore } from '@/store/dateFormats';
import { ColoredTable } from '&/table/coloredTable/ColoredTable';
import { SlideContent } from '&/slide/slideContent/SlideContent';
import { MessageInfoContainer } from '&/dashboard/cards/smsCard/smsCardContent/messageInfoContainer/MessageInfoContainer';
import { AssignedInfoContainer } from '&/dashboard/cards/smsCard/smsCardContent/assignedInfoContainer/AssignedInfoContainer';
import { SmsStatusContainer } from '&/dashboard/cards/smsCard/smsCardContent/smsStatusContainer/SmsStatusContainer';
import { LeadStatusContainer } from '&/dashboard/cards/smsCard/smsCardContent/leadStatusContainer/LeadStatusContainer';
import { AllSms } from '@/app/libs/definitions';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { startOfDay, endOfDay } from 'date-fns';
import { Button } from '@/app/ui/buttons/Button';
import { ThreeDots } from '@/app/ui/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { ConfirmNotification } from '@/app/ui/notifications/Notification';
import { TextAreaInput } from '@/app/ui/inputs/TextAreaInput';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';

export function SmsCard() {
  // ----- global states -----
  const { getAllClientsMessages } = clientMessagesStore();
  const { allClientsMessages } = clientMessagesStore();

  const { getCurrentSection } = currentSectionStore();

  const { dateFormatted } = dateFormatsStore();

  const { openDashboardSmsModal } = modalWindowStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  useEffect(() => {
    getAllClientsMessages().finally(() => {
      setLoading(false);
    });
    getCurrentSection('Sms and Email Slide');
  }, [getAllClientsMessages, getCurrentSection]);

  // ----- local states -----
  const [loading, setLoading] = useState<boolean>(true);

  const [inputs, setInputs] = useState<{
    leadTemp: {
      all: string;
      hot: string;
      warm: string;
      normal: string;
    };
    smsStatus: {
      read: string;
      unread: string;
      replied: string;
      unReplied: string;
    };
    smsEmail: {
      allSmsEmail: string;
      sms: string;
      email: string;
    };
    customer: string;
    assigned: string;
    fromSelected: Date | undefined;
    toSelected: Date | undefined;
  }>({
    leadTemp: {
      all: '',
      hot: '',
      warm: '',
      normal: '',
    },
    smsStatus: {
      read: '',
      unread: '',
      replied: '',
      unReplied: '',
    },
    smsEmail: {
      allSmsEmail: '',
      sms: '',
      email: '',
    },
    customer: '',
    assigned: '',
    fromSelected: undefined,
    toSelected: undefined,
  });

  const [buttonText, setButtonText] = useState<string>('');

  const [filteredData, setFilteredData] = useState<AllSms>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    if (e.currentTarget instanceof HTMLInputElement) {
      const { checked } = e.currentTarget;

      setInputs((prevState) => {
        const newState = { ...prevState };

        switch (name) {
          // leadTemp
          case 'all':
            newState.leadTemp.all = checked ? '1' : '';
            newState.leadTemp.hot = '';
            newState.leadTemp.normal = '';
            newState.leadTemp.warm = '';
            break;

          case 'hot':
            newState.leadTemp.hot = checked ? '3' : '';
            newState.leadTemp.all = '';
            break;
          case 'warm':
            newState.leadTemp.warm = checked ? '2' : '';
            newState.leadTemp.all = '';
            break;
          case 'normal':
            newState.leadTemp.normal = checked ? '1' : '';
            newState.leadTemp.all = '';
            break;

          // smsEmail
          case 'allSmsEmail':
            newState.smsEmail.allSmsEmail = checked ? '1' : '';
            newState.smsEmail.email = '';
            newState.smsEmail.sms = '';
            break;

          case 'sms':
          case 'email':
            newState.smsEmail[name] = checked ? '1' : '';
            newState.smsEmail.allSmsEmail = '';
            break;

          // smsStatus
          case 'read':
            newState.smsStatus.read = checked ? '1' : '';
            break;

          case 'unread':
            newState.smsStatus.unread = checked ? '2' : '';
            break;

          case 'replied':
            newState.smsStatus.replied = checked ? '3' : '';
            break;

          case 'unReplied':
            newState.smsStatus.unReplied = checked ? '4' : '';
            break;

          // customer
          case 'customer':
            newState.customer = value;
            break;

          // assigned
          case 'assigned':
            newState.assigned = value;
            break;
        }

        return newState;
      });
    }
  };

  const handleDateRange = (e: DateRange | undefined) => {
    setInputs((prevState) => ({
      ...prevState,
      fromSelected: e?.from ? e.from : undefined,
      toSelected: e?.to ? e.to : undefined,
    }));
  };

  const handleClearOrSetTodayDateFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'clearDateFilter') {
      setInputs((prevState) => ({
        ...prevState,
        fromSelected: undefined,
        toSelected: undefined,
      }));
    }

    if (identity === 'today') {
      setInputs((prevState) => ({
        ...prevState,
        fromSelected: startOfDay(new Date()),
        toSelected: undefined,
      }));
    }
  };

  const inputDataOne = [
    {
      id: 1,
      label: '',
      name: 'all',
      type: 'checkbox',
      width: 0,
      value: inputs.leadTemp.all,
      chekcboxText: 'All',
    },
    {
      id: 2,
      label: '',
      name: 'hot',
      type: 'checkbox',
      width: 0,
      value: inputs.leadTemp.hot,
      chekcboxText: 'Hot',
      temp: 3,
      leadIcon: true,
    },
    {
      id: 3,
      label: '',
      name: 'warm',
      type: 'checkbox',
      width: 0,
      value: inputs.leadTemp.warm,
      chekcboxText: 'Warm',
      temp: 2,
      leadIcon: true,
    },
    {
      id: 4,
      label: '',
      name: 'normal',
      type: 'checkbox',
      width: 0,
      value: inputs.leadTemp.normal,
      chekcboxText: 'Normal',
      temp: 1,
      leadIcon: true,
    },
  ];

  const inputDataTwo = [
    {
      id: 5,
      label: '',
      name: 'read',
      type: 'checkbox',
      width: 0,
      value: inputs.smsStatus.read,
      chekcboxText: 'Read',
    },
    {
      id: 6,
      label: '',
      name: 'unread',
      type: 'checkbox',
      width: 0,
      value: inputs.smsStatus.unread,
      chekcboxText: 'Unread',
    },
    {
      id: 7,
      label: '',
      name: 'replied',
      type: 'checkbox',
      width: 0,
      value: inputs.smsStatus.replied,
      chekcboxText: 'Replied',
    },
    {
      id: 8,
      label: '',
      name: 'unReplied',
      type: 'checkbox',
      width: 0,
      value: inputs.smsStatus.unReplied,
      chekcboxText: 'Un-Replied',
    },
  ];

  const inputThree = [
    {
      id: 9,
      label: '',
      name: 'allSmsEmail',
      type: 'checkbox',
      width: 0,
      value: inputs.smsEmail.allSmsEmail,
      chekcboxText: 'All',
    },
    {
      id: 10,
      label: '',
      name: 'sms',
      type: 'checkbox',
      width: 0,
      value: inputs.smsEmail.sms,
      chekcboxText: 'Sms',
    },
    {
      id: 11,
      label: '',
      name: 'email',
      type: 'checkbox',
      width: 0,
      value: inputs.smsEmail.email,
      chekcboxText: 'Email',
    },
  ];

  useEffect(() => {
    setButtonText(
      `${inputs.fromSelected ? dateFormatted(2, inputs.fromSelected) : ''}${
        inputs.toSelected
          ? inputs.toSelected !== inputs.fromSelected
            ? ` - ${dateFormatted(2, inputs.toSelected)}`
            : ''
          : ''
      }`,
    );
  }, [inputs.fromSelected, inputs.toSelected, dateFormatted]);

  const [tableData, setTableData] = useState<any[]>([
    {
      id: '',
      _blank_message: '',
      _blank_assigned_to: '',
      _blank_sms_status: '',
      _blank_lead_status: '',
      customerIdForSingleClientData: '',
      unknowCustomerIdForData: '',
    },
  ]);

  useEffect(() => {
    let newData = allClientsMessages;

    // smsEmail

    if (inputs.smsEmail.allSmsEmail) {
      newData = newData;
    }

    if (inputs.smsEmail.sms) {
      newData = newData;
    }

    if (inputs.smsEmail.email) {
      if (inputs.smsEmail.sms) {
        newData = newData;
      } else {
        newData = undefined;
      }
    }

    // lead temp

    const normal = inputs.leadTemp.normal;
    const warm = inputs.leadTemp.warm;
    const hot = inputs.leadTemp.hot;
    const all = inputs.leadTemp.all;

    if (all) {
      newData = newData;
    }

    if (normal || warm || hot) {
      newData = newData?.filter((el) => {
        const leadId = el.client_message?.lead_temperature_id;
        const leadArray: number[] = [];

        for (const [key, value] of Object.entries(inputs.leadTemp)) {
          leadArray.push(parseInt(value));
        }

        return leadArray.length > 0 && leadId && leadArray.includes(leadId);
      });
    }

    // sms status

    const read = inputs.smsStatus.read;
    const unread = inputs.smsStatus.unread;
    const replied = inputs.smsStatus.replied;
    const unreplied = inputs.smsStatus.unReplied;

    if (read || unread || replied || unreplied) {
      newData = newData?.filter((el) => {
        const smsStatusId = el.status_id;
        const statusArray: number[] = [];

        for (const [key, value] of Object.entries(inputs.smsStatus)) {
          statusArray.push(parseInt(value));
        }

        return statusArray.length > 0 && statusArray.includes(smsStatusId);
      });
    }

    // customer name

    if (inputs.customer) {
      const customerInputArray = inputs.customer.toLowerCase().split(' ');

      newData = newData?.filter((el) => {
        const customerName = el.client_message?.first_name.toLowerCase();
        const customerLastName = el.client_message?.last_name.toLowerCase();

        return customerInputArray.every(
          (word) => customerName?.includes(word) || customerLastName?.includes(word),
        );
      });
    }

    // assigned seller / bdc

    if (inputs.assigned) {
      const assignedInputArray = inputs.assigned.toLowerCase().split(' ');

      newData = newData?.filter((el) => {
        const assignedSellerName = el.client_message?.seller?.name?.toLowerCase() || '';
        const assignedSellerLastname = el.client_message?.seller?.last_name?.toLowerCase() || '';
        const assignedBdcName = el.client_message?.bdc?.name?.toLowerCase() || '';
        const assignedBdcLastname = el.client_message?.bdc?.last_name?.toLowerCase() || '';

        return assignedInputArray.every(
          (word) =>
            assignedSellerName.includes(word) ||
            assignedSellerLastname.includes(word) ||
            assignedBdcName.includes(word) ||
            assignedBdcLastname.includes(word),
        );
      });
    }

    // date picker

    // from
    if (inputs.fromSelected) {
      newData = newData?.filter(
        (el) =>
          inputs.fromSelected &&
          el.date_sent &&
          new Date(el.date_sent) >= startOfDay(new Date(inputs.fromSelected)),
      );
    }

    // to
    if (inputs.toSelected && inputs.toSelected !== inputs.fromSelected) {
      newData = newData?.filter(
        (el) =>
          inputs.toSelected &&
          el.date_sent &&
          new Date(el.date_sent) <= endOfDay(new Date(inputs.toSelected)),
      );
    }

    setFilteredData(newData);
  }, [allClientsMessages, inputs]);

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      const newTableData: any[] = [];

      filteredData.forEach((el, index) => {
        let noReadMessageCount = el.client_message?.conversation?.pending_reply_count || 0;
        noReadMessageCount =
          el.unregistered_customer.length > 0
            ? el.unregistered_customer[0].conversation?.pending_reply_count || 0
            : noReadMessageCount;

        newTableData.push({
          id: `${el.id * (el.client_id ? el.client_id : 23)}_=${index * 3}`,
          customerIdForSingleClientData: el?.client_id,
          unknowCustomerIdForData: el?.unregistered_customer[0]?.mobile_phone_number,
          _blank_message: (
            <MessageInfoContainer
              customerId={el.client_id}
              customerName={`${
                el.client_message?.first_name ||
                formatPhoneNumber(el.unregistered_customer[0]?.mobile_phone_number || '') ||
                'Unknow'
              } ${el.client_message?.last_name || ''}`}
              customerStatus={
                el.client_message?.lead && el.client_message?.lead.length > 0
                  ? el.client_message.lead[0].customer_status?.status || ''
                  : 'Unregistered customer'
              }
              lastMessage={el.message}
              messageDate={el.date_sent}
              noReadMessageCount={noReadMessageCount}
              file={el.fileAttachment ? true : false}
            />
          ),
          _blank_assigned_to: (
            <AssignedInfoContainer
              bdcAssigned={
                el.client_message?.bdc
                  ? `${
                      el.client_message.bdc?.username ? `${el.client_message.bdc?.username} -` : ''
                    } ${el.client_message.bdc?.name || ''} ${
                      el.client_message.bdc?.last_name || ''
                    }`
                  : ''
              }
              sellerAssigned={`${
                el?.client_message?.seller?.username
                  ? `${el.client_message.seller?.username} -`
                  : ''
              } ${el.client_message?.seller?.name || ''} ${
                el.client_message?.seller?.last_name || ''
              }`}
            />
          ),
          _blank_sms_status: <SmsStatusContainer smsStatus={el.status_id} readBy={el.read_by} />,
          _blank_lead_status: (
            <LeadStatusContainer leadStatus={el.client_message?.lead_temperature_id} />
          ),
          _blank_options: (
            <OptionButton
              isShow={noReadMessageCount > 0}
              clientId={el.client_id}
              unregisteredCustomerId={
                el.unregistered_customer.length > 0 ? el.unregistered_customer[0]?.id : null
              }
            />
          ),
        });
      });

      setTableData(newTableData);
    } else {
      setTableData([
        {
          id: '',
          _blank_message: '',
          _blank_assigned_to: '',
          _blank_sms_status: '',
          _blank_lead_status: '',
          customerIdForSingleClientData: '',
          unknowCustomerIdForData: '',
        },
      ]);
    }
  }, [filteredData, formatPhoneNumber]);

  const customColumnsWidth = [
    {
      column: '_blank_message',
      widthInPorcent: 57,
    },
    {
      column: '_blank_assigned_to',
      widthInPorcent: 14.333333,
    },
    {
      column: '_blank_sms_status',
      widthInPorcent: 14.333333,
    },
    {
      column: '_blank_lead_status',
      widthInPorcent: 14.333333,
    },
  ];

  return (
    <Slide title="SMS and Emails">
      <SlideContent paddingX={1}>
        <SmsFilter
          inputDataOne={inputDataOne}
          inputDataTwo={inputDataTwo}
          inputDataThree={inputThree}
          customer={inputs.customer}
          assigned={inputs.assigned}
          onChange={handleChange}
          selectedFromRange={inputs.fromSelected}
          selectedToDate={inputs.toSelected}
          buttonText={buttonText}
          handleDateRange={handleDateRange}
          handleClearOrSetTodayDateFilter={handleClearOrSetTodayDateFilter}
        />
        <div className="mb-[1.3vh]"></div>
        <ColoredTable
          height={51.5}
          tableData={tableData}
          textColor="#FFF"
          paginationTable
          headerTrHeightHidden
          loading={loading}
          bodyRowClickEvent={openDashboardSmsModal}
          customColumnWidth={customColumnsWidth}
          itemsPerPage={5}
        />
      </SlideContent>
    </Slide>
  );
}

export function OptionButton({
  clientId,
  unregisteredCustomerId,
  isShow,
}: {
  clientId: number | null;
  unregisteredCustomerId: number | null;
  isShow: boolean;
}) {
  // ----- global states -----
  const { setMessages } = messagesStore();
  const { updateDataWithSocket } = useSocketStore();

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleOpen();
    setShowConfirmation(!showConfirmation);
  };

  const handleDecision = async (isYes: boolean) => {
    if (isYes) {
      setLoading(true);
      const formData = new FormData();

      formData.append('note', note);
      if (unregisteredCustomerId) {
        formData.append('unregisteredCustomerId', unregisteredCustomerId.toString());
      }
      if (clientId) {
        formData.append('clientId', clientId.toString());
      }

      const apiUrl = `/api/conversation`;
      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        options: {
          onSuccess: (data) => {
            setShowConfirmation(false);
            updateDataWithSocket('customerMessage');
          },
        },
      });
      setLoading(false);
    } else {
      setShowConfirmation(false);
    }
  };

  if (!isShow) return null;

  return (
    <div className="relative w-fit mx-auto pr-[1rem]" ref={ref}>
      <Button
        width={2.03125}
        height={2.03125}
        heightVw
        backgroundColor="#FFFFFF40"
        identity="option"
        textColor=""
        dropShadow
        buttonIcon={<ThreeDots />}
        onClick={toggleOpen}
      />
      {isOpen && (
        <aside className="absolute top-0 z-10 right-[2.5vw] min-w-[10.833333vw] px-[1rem] h-fit flex flex-col bg-white rounded-[0.520833vw] text-[2vh] font-medium text-[#00A78B] shadow-crmFormShadow overflow-hidden">
          <button
            onClick={handleButton}
            className="w-full text-nowrap px-2 h-[6vh] hover:bg-[#C9EBE6] transition-colors"
            data-identity="edit"
          >
            Remove Notification
          </button>
        </aside>
      )}
      {showConfirmation && (
        <ConfirmNotification
          notiMessage="Are you sure you want to remove this notification?"
          loading={loadingFetch}
          onDecision={handleDecision}
        >
          <TextAreaInput
            label="Note:"
            name="note"
            value={note}
            width={0}
            height={8.425926}
            onChange={(e) => setNote(e.target.value)}
            widthFull
            fieldErrors={fieldErrors}
            placeholder="Reason"
          />
        </ConfirmNotification>
      )}
    </div>
  );
}
