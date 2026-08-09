import useUiHandler from '@/hooks/closeComponentsHandler';
import { Picker } from './picker/Picker';
import { Can } from '&/auth/Can';

export function UserPicker({
  customerId,
  bdc,
  financeManager,
  salesManager,
  salesRep,
  onSuccess,
  pickerParentAbsolutePos,
  leadId,
}: {
  customerId: number;
  salesRep?: {
    id?: number | null;
    name?: string;
    lastname?: string;
    appId?: number;
    userFullname?: string | null;
  };
  bdc?: { id?: number | null; name?: string; lastname?: string; userFullname?: string | null };
  financeManager?: {
    id?: number | null;
    name?: string;
    lastname?: string;
    userFullname?: string | null;
  };
  salesManager?: {
    id?: number | null;
    name?: string;
    lastname?: string;
    userFullname?: string | null;
  };
  onSuccess?: () => void;
  pickerParentAbsolutePos?: boolean;
  leadId?: number;
}) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const returnUserName = () => {
    let name = 'Assign';
    let lastname = 'User';

    if (!salesRep?.id && !bdc?.id && !financeManager?.id && !salesManager?.id)
      return `${name} ${lastname}`;

    if (salesRep && salesRep.name && !salesRep.userFullname) name = salesRep.name;
    if (salesRep && salesRep.lastname && !salesRep.userFullname) lastname = salesRep.lastname;
    if (salesRep?.userFullname) return salesRep?.userFullname;

    if (bdc && bdc.name && !bdc.userFullname) name = bdc.name;
    if (bdc && bdc.lastname && !bdc.userFullname) lastname = bdc.lastname;
    if (bdc?.userFullname) return bdc?.userFullname;

    if (financeManager && financeManager.name && !financeManager.userFullname)
      name = financeManager.name;
    if (financeManager && financeManager.lastname && !financeManager.userFullname)
      lastname = financeManager.lastname;
    if (financeManager?.userFullname) return financeManager?.userFullname;

    if (salesManager && salesManager.name && !salesManager.userFullname) name = salesManager.name;
    if (salesManager && salesManager.lastname && !salesManager.userFullname)
      lastname = salesManager.lastname;
    if (salesManager?.userFullname) return salesManager?.userFullname;

    return `${name} ${lastname}`;
  };

  const handleUserType = () => {
    let userType = '';

    if (salesRep) userType = 'salesRep';

    if (bdc) userType = 'bdc';

    if (financeManager) userType = 'financeManager';

    if (salesManager) userType = 'salesManager';

    return userType;
  };

  return (
    <Can requiredPermission={69} fallback={<p>{returnUserName()}</p>}>
      <div
        ref={ref}
        className={
          pickerParentAbsolutePos ? 'absolute top-[50%] translate-y-[-50%] w-[9vw]' : 'relative'
        }
      >
        {!isOpen && (
          <button type="button" onClick={toggleOpen} className="hover:opacity-80 transition-all">
            {isOpen ? '' : returnUserName()}
          </button>
        )}
        {isOpen && (
          <Picker
            leadId={leadId}
            customerId={customerId}
            userType={handleUserType()}
            appId={salesRep?.appId}
            onSuccess={onSuccess}
          />
        )}
      </div>
    </Can>
  );
}
