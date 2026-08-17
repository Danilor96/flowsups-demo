import { modalWindowStore } from '@/store/adminDashboard';
import { FlowsupsBtn } from './flowsupsBtn/FlowsupsBtn';
import { FlowsupsArrows } from './flowsupsArrows/FlowsupsArrows';

export function FlowsupsContent() {
  // ----- global states -----

  const { openInNewTab } = modalWindowStore();

  const {
    openNewCustomersList,
    openContactAttemptCustomersList,
    openContactedCustomersList,
    openCreditAppCustomersList,
    openShowUpCustomersList,
    openLostCustomersList,
    openNoShowUpCustomersList,
    openSoldCustomersList,
    openDepositCustomersList,
    openDeliveryCustomersList,
    openUndeliveredCustomersList,
    openAppointmentCustomersList,
    openPaidCustomersList,
  } = modalWindowStore();

  // ----- local states -----

  const btnData = [
    {
      key: 1,
      top: 14,
      left: 2.604167,
      text: 'New',
      onClick: openNewCustomersList,
    },
    {
      key: 13,
      top: 34 ,
      left: 16,
      text: 'Contact Attempt',
      onClick: openContactAttemptCustomersList,
      textWrap: true,
    },
    {
      key: 2,
      top: 45,
      left: 2.604167,
      text: 'Lost',
      onClick: openLostCustomersList,
    },
    {
      key: 3,
      top: 9,
      left: 15.9375,
      text: 'Contacted',
      onClick: openContactedCustomersList,
    },
    {
      key: 4,
      top: 5.5,
      left: 31.5625,
      text: 'Credit App',
      onClick: openCreditAppCustomersList,
    },
    {
      key: 5,
      top: 27.5,
      left: 31.5625,
      text: 'Appointment',
      onClick: openAppointmentCustomersList,
    },
    {
      key: 6,
      top: 5.5,
      left: 45.46875,
      text: 'Delivery',
      onClick: openDeliveryCustomersList,
    },
    {
      key: 7,
      top: 27.5,
      left: 45.46875,
      text: 'Show Up',
      onClick: openShowUpCustomersList,
    },
    {
      key: 8,
      top: 49.5,
      left: 45.46875,
      text: 'No Show Up',
      onClick: openNoShowUpCustomersList,
    },
    {
      key: 9,
      top: 27.5,
      left: 58.90625,
      text: 'Deposit',
      onClick: openDepositCustomersList,
    },
    {
      key: 10,
      top: 6,
      left: 71.927083,
      text: 'Undelivered',
      onClick: openUndeliveredCustomersList,
    },
    {
      key: 11,
      top: 28,
      left: 71.927083,
      text: 'Sold',
      onClick: openSoldCustomersList,
    },
    {
      key: 12,
      top: 50,
      left: 71.927083,
      text: 'Funding',
      onClick: openPaidCustomersList,
    },
  ];

  return (
    <>
      <div className="lg-only">
        {btnData.map((el, index) => (
          <FlowsupsBtn
            onClick={() => {
              if (openInNewTab) {
                const flowsupsTextFormatted = el.text.toLowerCase().replaceAll(' ', '');

                window.open(`/dashboard/${flowsupsTextFormatted}`);

                return;
              }

              el.onClick();
            }}
            key={`flupsbtn-${el.key}`}
            left={el.left}
            text={el.text}
            top={el.top}
            textWrap={el.textWrap}
          />
        ))}
        <FlowsupsArrows />
      </div>
      <div className="below-lg-only grid grid-cols-2 gap-3 px-4 py-4 w-full">
        {btnData.map((el, index) => (
          <button
            type="button"
            key={`flupsbtn-mobile-${el.key}`}
            onClick={() => {
              if (openInNewTab) {
                const flowsupsTextFormatted = el.text.toLowerCase().replaceAll(' ', '');

                window.open(`/dashboard/${flowsupsTextFormatted}`);

                return;
              }

              el.onClick();
            }}
            className="flex justify-center items-center px-3 py-4 rounded-full bg-[#7CC2B4] text-white text-sm font-semibold shadow-lg text-center"
          >
            {el.text}
          </button>
        ))}
      </div>
    </>
  );
}
