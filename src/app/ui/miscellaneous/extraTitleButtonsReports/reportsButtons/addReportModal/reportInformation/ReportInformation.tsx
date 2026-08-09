import { UserPermissionsTable } from '@/app/ui/dashboard/clientSystem/customerList/ReportButtons/Permision/UserPermissionsTable';
import { ContainerSection } from '../containerSection/ContainerSection';
import { CheckboxInput } from '@/app/ui/inputs/CheckboxInput';
import { ReportIcon } from '@/app/ui/icons/Icons';
import { motion } from 'framer-motion';
import { Input } from '@/app/ui/inputs/Input';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserPermission } from '@/app/ui/dashboard/clientSystem/customerList/ReportButtons/Permision/useUserPermission';

export const ReportInformation = ({
  reportName,
  setReportName,
  forCompany,
  setForCompany,
  nameFieldErrors = null,
  onAllowedUserIdsChange,
}: {
  reportName: string;
  setReportName: (name: string) => void;
  forCompany: boolean;
  setForCompany: (forCompany: boolean) => void;
  nameFieldErrors?: string | null;
  onAllowedUserIdsChange?: (allowedUserIds: number[]) => void;
}) => {
  const session = useSession();
  const userHas = session.data?.user.user_has;
  const userIsManager = userHas?.some(
    (userHas) =>
      userHas.role_id === 3 ||
      userHas.role_id === 4 ||
      userHas.role_id === 1 ||
      userHas.role_id === 2,
  );

  const { users, idsSelected, onlyManagers, handleUserSelect, setIdsSelected, setOnlyManagers } =
    useUserPermission();

  useEffect(() => {
    if (onAllowedUserIdsChange) {
      onAllowedUserIdsChange(idsSelected);
    }
  }, [idsSelected, onAllowedUserIdsChange]);

  return (
    <ContainerSection title="Report Information">
      <div>
        <div className="flex flex-col gap-2">
          <Input
            label="Report name"
            name="name"
            type="text"
            placeholder="Enter name"
            width={32}
            borderRadius={0.6}
            value={reportName}
            onChange={(e) => {
              if (e.target.value === ' ') return;
              setReportName(e.target.value);
            }}
          />
          {nameFieldErrors && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-[1.666667vh] text-[#F00]"
            >
              {nameFieldErrors}
            </motion.p>
          )}
        </div>
        <div className="flex flex-col mt-6 gap-2">
          <span className=" text-[#999999]">Category</span>
          <div className="flex gap-4">
            <button
              className={`border-2 border-[#C9EBE6] rounded-2xl flex flex-col justify-center items-center 
                gap-4 w-32 h-32  text-[#00A78B] ${!forCompany && 'bg-[#C9EBE6]'} `}
              onClick={() => setForCompany(false)}
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 45 69"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 69H45V56.6786C44.9952 52.1052 43.3343 47.7206 40.3817 44.4867C37.429 41.2529 33.4257 39.4338 29.25 39.4286H15.75C11.5743 39.4338 7.571 41.2529 4.61833 44.4867C1.66566 47.7206 0.00476406 52.1052 0 56.6786V69ZM6.75 17.25C6.75 20.6617 7.67372 23.9968 9.40435 26.8336C11.135 29.6703 13.5948 31.8813 16.4727 33.1869C19.3507 34.4925 22.5175 34.8341 25.5727 34.1685C28.6279 33.5029 31.4343 31.86 33.6369 29.4476C35.8396 27.0351 37.3397 23.9615 37.9474 20.6153C38.5551 17.2691 38.2432 13.8007 37.0511 10.6487C35.859 7.49669 33.8403 4.8026 31.2502 2.90715C28.6602 1.0117 25.6151 0 22.5 0C18.3228 0 14.3168 1.81741 11.3631 5.05241C8.40937 8.28741 6.75 12.675 6.75 17.25Z"
                  fill="#00A78B"
                />
              </svg>
              <span>My Reports</span>
            </button>
            <button
              className={`border-2 border-[#C9EBE6] rounded-2xl flex flex-col justify-center items-center gap-4 w-32 h-32 
                 text-[#00A78B] ${forCompany && 'bg-[#C9EBE6]'} ${!userIsManager ? 'hidden' : ''}`}
              onClick={() => setForCompany(true)}
              disabled={!userIsManager}
            >
              <ReportIcon />
              <span>Company</span>
            </button>
          </div>
        </div>
        <div className="mt-2">
          {forCompany && (
            <div className="min-w-[40vw] max-h-[33vh] overflow-y-auto pr-1 relative">
              <div className="w-full justify-end flex mb-2 sticky top-0 bg-white z-10">
                <CheckboxInput
                  name="onlyManagers"
                  value={''}
                  checked={onlyManagers}
                  onChange={(e) => {
                    setOnlyManagers(e.target.checked);
                  }}
                  chekcboxText="This is a Management Report"
                />
              </div>
              <UserPermissionsTable
                users={users}
                handleSelect={handleUserSelect}
                idsSelected={idsSelected}
              />
            </div>
          )}
        </div>
      </div>
    </ContainerSection>
  );
};
