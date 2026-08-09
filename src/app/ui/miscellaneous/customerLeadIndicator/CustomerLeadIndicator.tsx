import { leadsStore } from '@/store/leads';
import { RegularSearchableSelect } from '&/select/regularSearchableSelect/RegularSearchableSelect';
import { messagesStore, modalWindowStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ConfirmNotification } from '&/notifications/Notification';

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export function CustomerLeadIndicator() {
  // ----- global states -----

  const { leads, getLeads } = leadsStore();

  const currentLead = leadsStore((state) => state.currentLead);
  const setCurrentLead = leadsStore((state) => state.setCurrentLead);

  const { loadingCustomerDetail } = modalWindowStore();
  const { setLoadingCustomerDetail } = modalWindowStore();

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const setMssg = messagesStore((state) => state.setMessages);

  // ----- local states -----

  const [confirmDeleteLead, setConfirmDeleteLead] = useState<{ id: string; label: string } | null>(
    null,
  );
  const [deletingLead, setDeletingLead] = useState(false);


  const handleClick = async (value: string, identity?: string, name?: string) => {
    if (currentLead === value || !singleCLientData) return;

    setLoadingCustomerDetail(true);

    try {
      setCurrentLead(value);
      await getSingleClientData(singleCLientData.id.toString(), value);
    } catch (error) {
      setMssg('An error ocurred');
    }

    setLoadingCustomerDetail(false);
  };

  const handleDeleteDecision = async (decision: boolean) => {
    if (!decision) {
      setConfirmDeleteLead(null);
      return;
    }

    if (!confirmDeleteLead || !singleCLientData) {
      setConfirmDeleteLead(null);
      return;
    }

    setDeletingLead(true);

    try {
      const res = await fetch(`/api/lead/${confirmDeleteLead.id}`, { method: 'DELETE' });

      if (!res.ok) throw new Error('Delete failed');

      // Refresh leads for this customer
      await getLeads(singleCLientData.id);

      // Always activate the last remaining lead
      const updatedLeads = leadsStore.getState().leads;
      if (updatedLeads && updatedLeads.length > 0) {
        const lastLead = updatedLeads[updatedLeads.length - 1];
        setCurrentLead(lastLead.id.toString());
        await getSingleClientData(singleCLientData.id.toString(), lastLead.id.toString());
      }

      setMssg(undefined, 'Lead deleted successfully');
    } catch (error) {
      setMssg('An error ocurred while deleting the lead');
    }

    setDeletingLead(false);
    setConfirmDeleteLead(null);
  };

  useEffect(() => {
    if (leads && leads.length > 0 && !currentLead) {
      leads.forEach((lead) => {
        const activeLead = lead.is_selected === true ? lead : null;
        if (activeLead) {
          setCurrentLead(activeLead.id.toString());
        }
      });
    }
  }, [leads]);

  const options = leads?.map((el, index) => ({
    name: `Lead ${index + 1}`,
    value: el.id.toString(),
    icon:
      index > 0 ? (
        <button
          type="button"
          title={`Delete Lead ${index + 1}`}
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: 'none',
            border: '0.1vw solid #ED0000',
            borderRadius: '0.4vw',
            padding: '0.25vh 0.3vw',
            cursor: 'pointer',
            color: '#ED0000',
            transition: 'background 0.15s, color 0.15s',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setConfirmDeleteLead({ id: el.id.toString(), label: `Lead ${index + 1}` });
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ED0000';
            e.currentTarget.style.color = '#FFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = '#ED0000';
          }}
        >
          <TrashIcon />
        </button>
      ) : null,
  }));

  return (
    <>
      <aside>
        <RegularSearchableSelect
          iconTextGap={0}
          label=""
          name=""
          optionsBackgroundColor="#FFF"
          optionsHeight={4}
          optionsPaddingY={0.5}
          optionsContainerHeight={15}
          optionsRadius={0.05}
          optionsWidth={7}
          value={currentLead}
          textColor="#00a78b"
          noTextSearch
          loading={loadingCustomerDetail}
          width={7}
          options={options}
          onClick={handleClick}
        />
      </aside>

      <AnimatePresence>
        {confirmDeleteLead && (
          <ConfirmNotification
            notiMessage="Are you sure you want to delete "
            alterNotiMessage={confirmDeleteLead.label}
            alterNotiMessageColor="#ED0000"
            loading={deletingLead}
            textWidth={40}
            yesAlterText="Delete"
            noAlterText="Cancel"
            onDecision={handleDeleteDecision}
          />
        )}
      </AnimatePresence>
    </>
  );
}
