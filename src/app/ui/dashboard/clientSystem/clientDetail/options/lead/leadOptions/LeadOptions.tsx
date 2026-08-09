import { useCallback, useEffect, useState } from 'react';
import { MarkAsLost } from './markAsLost/MarkAsLost';
import { Note } from './note/Note';
import { AppointmentSchedule } from './appointmentSchedule/Schedule';
import { SpokeProspect } from './spokeProspect/SpokeProspect';
import { LeftMessage } from './leftMessage/LeftMessage';
import { NoAnswer } from './noAnswer/NoAnswer';
import { BadPhoneNumber } from './badPhoneNumber/BadPhoneNumber';
import { ManualSmsSent } from './manualSmsSent/ManualSmsSent';
import { ManualEmailSent } from './manualEmailSent/ManualEmailSent';
import { ReceivedSmsFromProspect } from './receivedSmsFromProspect/ReceivedSmsFromProspect';
import { ReceivedEmailFromProspect } from './receivedEmailFromProspect/ReceivedEmailFromProspect';
import { ProspectVisitedDealership } from './prospectVisitedDealership/ProspectVisitedDealership';
import { ProspectTest } from './prospectTest/ProspectTest';
import { DealInProgres } from './dealInProgress/DealInProgres';
import { Sold } from './sold/Sold';
import { ProspectRequestedDnc } from './prospectRequestedDnc/ProspectRequestedDnc';
import { AddATask } from './addTask/AddATask';
import { SetStatus } from './setStatus/SetStatus';
import { VehicleScheduled } from './vehicleScheduled/VehicleScheduled';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { OptionCheckbox } from './optionCheckbox/OptionCheckbox';
import { adminDashboardStore } from '@/store/adminDashboard';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { leadCardStore } from '@/store/leadCard';

export enum LeadsIds {
  ['Add note'] = 1,
  ['Appointment Schedule'] = 2,
  ['Spoke to Prospect'] = 3,
  ['Left Message'] = 4,
  ['No Answer'] = 5,
  ['Bad Phone Number'] = 6,
  ['Manual SMS Sent'] = 7,
  ['Manual Email Sent'] = 8,
  ['Received SMS from Prospect'] = 9,
  ['Received Email from Prospect'] = 10,
  ['Prospect Visited Delearship'] = 11,
  ['Prospect Test Drove Vehicle/Demo'] = 12,
  ['Deal in Progress'] = 13,
  ['Sold'] = 14,
  ['Mark as Lost'] = 15,
  ['Prospect Requested DNC'] = 16,
  ['Add a Task'] = 17,
  ['Set Status'] = 18,
  ['Delivery Scheduled'] = 19,
}

const leadComponentMap: { [key: string]: React.ReactNode } = {
  ['Add note']: <Note />,
  ['Appointment Schedule']: <AppointmentSchedule />,
  ['Spoke to Prospect']: <SpokeProspect />,
  ['Left Message']: <LeftMessage />,
  ['No Answer']: <NoAnswer />,
  ['Bad Phone Number']: <BadPhoneNumber />,
  ['Manual SMS Sent']: <ManualSmsSent />,
  ['Manual Email Sent']: <ManualEmailSent />,
  ['Received SMS from Prospect']: <ReceivedSmsFromProspect />,
  ['Received Email from Prospect']: <ReceivedEmailFromProspect />,
  ['Prospect Visited Delearship']: <ProspectVisitedDealership />,
  ['Prospect Test Drove Vehicle/Demo']: <ProspectTest />,
  ['Deal in Progress']: <DealInProgres />,
  ['Sold']: <Sold />,
  ['Mark as Lost']: <MarkAsLost />,
  ['Prospect Requested DNC']: <ProspectRequestedDnc />,
  ['Add a Task']: <AddATask />,
  ['Set Status']: <SetStatus />,
  ['Delivery Scheduled']: <VehicleScheduled />,
};

export function LeadOptions() {
  // ----- global states -----

  const { clientDetailLeadData } = adminDashboardStore();
  const { getClientDetailLead } = adminDashboardStore();

  const { callIdToAddNote } = leadCardStore();

  const getPromiseData = useCallback(() => {
    return [getClientDetailLead()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const [leadOptions, setLeadOptions] = useState<
    { id: number; lead: string; checked: boolean; component: React.ReactNode }[]
  >([]);

  useEffect(() => {
    if (clientDetailLeadData && clientDetailLeadData.length > 0) {
      const leads: { id: number; lead: string; checked: boolean; component: React.ReactNode }[] =
        [];

      const ignoreThisLeads = ['Removed Notification', 'Deposit', 'Mark as Lost', 'Set Status', 'Sold'];

      if (callIdToAddNote) {
        const spokeToPropspect = clientDetailLeadData.find((el) => el.lead === 'Spoke to Prospect');

        if (spokeToPropspect) {
          leads.push({
            id: spokeToPropspect.id,
            lead: spokeToPropspect.lead,
            checked: true,
            component: leadComponentMap[spokeToPropspect.lead],
          });

          setLeadOptions(leads);
        }

        return;
      }

      clientDetailLeadData.forEach((el, index) => {
        if (!ignoreThisLeads.includes(el.lead)) {
          leads.push({
            id: el.id,
            lead: el.lead,
            checked: false,
            component: leadComponentMap[el.lead],
          });
        }
      });

      setLeadOptions(leads);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientDetailLeadData]);

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = e.currentTarget;

    setLeadOptions((prevState) => {
      const newVal = [...prevState];

      for (let i = 0; i < newVal.length; i++) {
        const lead = newVal[i];

        lead.id === parseInt(name)
          ? (lead.checked = checked ? true : false)
          : (lead.checked = false);
      }

      return newVal;
    });
  };

  return (
    <ContentRow cols={1} gap={1} widthFull>
      <BorderedContent loading={loading} positionRelative>
        <ContentRow cols={2} gap={2.25}>
          {leadOptions &&
            leadOptions.length > 0 &&
            leadOptions.map((el, index) => (
              <OptionCheckbox
                key={`leadOpt--${el.id + 8}...${index * 33}`}
                lead={el.lead}
                id={el.id}
                checked={el.checked}
                onChange={handleCheckbox}
              />
            ))}
        </ContentRow>
      </BorderedContent>
      {leadOptions.find((el) => el.checked)?.component}
    </ContentRow>
  );
}
