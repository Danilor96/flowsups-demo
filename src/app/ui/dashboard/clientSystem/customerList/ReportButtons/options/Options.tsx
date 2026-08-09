import { messagesStore } from '@/store/adminDashboard';
import { customerListStore } from '@/store/customerList/customerList.store';
import { postCustomerReportAsFavorite } from '../../CustomerReportsSelect/customerReport.service';
import { useSession } from 'next-auth/react';

export function Options() {
  // ----- global states -----
  const toggleSaveAsModal = customerListStore(state => state.toggleSaveAsModal);
  const currentCustomerReport = customerListStore(state => state.currentCustomerReport);
  const refreshCustomerReportToggle = customerListStore(state => state.refreshCustomerReportToggle);
  const setCurrentCustomerReport = customerListStore(state => state.setCurrentCustomerReport);
  const setMessages = messagesStore(state => state.setMessages);
  const toggleNewCustomerReportModal = customerListStore(state => state.toggleNewCustomerReportModal);
  const openCloseReportModal = customerListStore(state => state.toggleSendReportModal);
  const [openClosepermissionsModal] = customerListStore(state => [state.openClosePermissionsModal]);

  const session = useSession();
  
  const userHas = session.data?.user.user_has
  const isManager = userHas?.some(userHas => userHas.role_id === 3 || userHas.role_id === 4 || userHas.role_id === 1 || userHas.role_id === 2);
  
  // ----- local states -----

  const options = [
    'Add new report',
    'Save As',
    'Set as favorite',
    'Set as default',
    'Send report',
    'Delete report',
    'Manage permissions'
  ];

  const handleSetAsFavorite = async () => {
    if (!currentCustomerReport) return;
    // ostimistic update
    const currentIsFavorite = currentCustomerReport.favoriteBy && currentCustomerReport.favoriteBy.length > 0;
    const originalCurrentCustomerReport = { ...currentCustomerReport };
    setCurrentCustomerReport({
      ...currentCustomerReport,
      favoriteBy: currentIsFavorite ? [] : [{ id: currentCustomerReport.owner_user_id }]
    });

    try {
      const response = await postCustomerReportAsFavorite(currentCustomerReport.id, !currentIsFavorite);

      if (response.ok) {
        const data = await response.json();
        setMessages(undefined, data.successMessage);
        refreshCustomerReportToggle();
      }
      if (!response.ok) {
        const data = await response.json();
        setMessages(data.serverError);
        setCurrentCustomerReport(originalCurrentCustomerReport);
      }
    } catch (error) {
      setMessages('Server Error');
      setCurrentCustomerReport(originalCurrentCustomerReport);
    }
  };

  const handleSetReportAdDefault = async () => {
    if (!currentCustomerReport) return;
    // ostimistic update
    const currentIsDefault = currentCustomerReport.defaultBy && currentCustomerReport.defaultBy.length > 0;
    console.log('currentIsDefault: ', currentIsDefault, currentCustomerReport.id);
    const originalCurrentCustomerReport = { ...currentCustomerReport };
    setCurrentCustomerReport({
      ...currentCustomerReport,
      defaultBy: currentIsDefault ? [] : [{ id: currentCustomerReport.owner_user_id }]
    });

    const { id } = currentCustomerReport;

    try {
      const response = await fetch(`/api/adminDashboard/reports/customer-list/setAsDefault/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(undefined, data.successMessage);
        refreshCustomerReportToggle();
      }
      if (!response.ok) {
        const data = await response.json();
        setCurrentCustomerReport(originalCurrentCustomerReport);
        setMessages(data.serverError || data.error);
      }
    } catch (error) {
      setCurrentCustomerReport(originalCurrentCustomerReport);
      setMessages('Server Error');
    }
  };

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    switch (identity) {
      case '0':
        toggleNewCustomerReportModal();
        break;

      case '1':
        toggleSaveAsModal();
        break;

      case '2':
        handleSetAsFavorite();
        break;

      case '3':
        handleSetReportAdDefault();
        break;

      case '4':
        openCloseReportModal();
        break;

      case '5':
        if (currentCustomerReport) {
          fetch(`/api/adminDashboard/reports/customer-list/${currentCustomerReport.id}`, {
            method: 'DELETE'
          }).then(res => {
            if (res.ok) {
              res.json().then(json => {
                setMessages(undefined, json.successMessage);
                refreshCustomerReportToggle();
              });
            }
            if (!res.ok) {
              res.json().then(json => setMessages(json.serverError));
            }
          });
        }
        break;

      case '6':
        openClosepermissionsModal();
        break;
    }
  };

  const getLabel = (index: number) => {
    const currentReportIsFavorite = currentCustomerReport?.favoriteBy && currentCustomerReport?.favoriteBy.length > 0;
    const currentReportIsDefault = currentCustomerReport?.defaultBy && currentCustomerReport?.defaultBy.length > 0;
    if (index === 2) {
      return currentReportIsFavorite ? 'Remove from favorites' : 'Set as favorite';
    }
    if (index === 3) {
      return currentReportIsDefault ? 'Remove as default' : 'Set as default';
    }
    return options[index];
  };

  const currentReportIsDefault =
    (currentCustomerReport?.defaultBy && currentCustomerReport?.defaultBy.length > 0) ||
    currentCustomerReport?.id === 0;

  const optionIsDisabled = (index: number) => {
    if (index === 5 && currentReportIsDefault) {
      return true;
    }

    // manage permissions
    if (index === 6 && (!currentCustomerReport?.for_company || !isManager)) return true;

    if((index ===  2 || index === 3) && currentCustomerReport?.id === 0) {
      return true;
    }

    return false;
  };

  return (
    <ul className="absolute top-[6.5vh] right-[50%] translate-x-[50%] z-10 w-[15vw] rounded-[0.520833vw] bg-white shadow-addNewReportHeadShadow overflow-hidden">
      {options.map((el, index) => (
        <button
          key={`${index + 11}bulkbtn${index * index}__`}
          onClick={handleButton}
          data-identity={index}
          className={`${
            optionIsDisabled(index) ? 'text-gray-300 hover:bg-white hidden' : ''
          } w-full h-fit px-[1.5625vw] py-[1.37037vh] text-left text-[2vh] text-[#00A78B] hover:bg-[#C9EBE6] transition-colors`}
          disabled={optionIsDisabled(index)}
        >
          {getLabel(index)}
        </button>
      ))}
    </ul>
  );
}
