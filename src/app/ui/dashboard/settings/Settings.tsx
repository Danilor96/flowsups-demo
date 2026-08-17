import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AddUserIcon,
  ManageIntegrationsIcon,
  ManageRolesIcon,
  ManageUsersIcon,
  StoreSettingsIcon,
  ManageNotificationsIcon,
  CustomerSettingsIcon,
  SystemAccessIcon,
} from '&/icons/Icons';
import { currentSectionStore, modalWindowStore } from '@/store/adminDashboard';
import { AddNewUser } from '&/dashboard/settings/addNewUser/AddNewUser';
import { UsersList } from '&/dashboard/settings/usersList/UsersList';
import { RoleList } from '&/dashboard/settings/manageRoles/RolesList';
import { Business } from '&/dashboard/settings/storeSystem/Business';
import { ManageNotifications } from '&/dashboard/settings/manageNotifications/ManageNotifications';
import { Customer } from '&/dashboard/settings/customer/Customer';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { useCan } from '@/hooks/permissions';

export function Settings() {
  // ----- global states -----

  const {
    addNewUser,
    manageUsers,
    manageIntegrations,
    manageRoles,
    storeSettings,
    businessInfo,
    manageNotifications,
    customerSettings,
    openCustomerSettingsFromConsentWindow,
  } = modalWindowStore();

  const {
    closeSettings,
    openAddNewUser,
    openManageUsers,
    openManageIntegrations,
    openManageRoles,
    openStoreSettings,
    openBusinessInfo,
    openManageNotifications,
    openCloseCustomerSettings,
    openCloseCustomerSettingsFromConsentWindow,
  } = modalWindowStore();

  const { getCurrentSection } = currentSectionStore();

  useEffect(() => {
    getCurrentSection('Settings');
  }, [getCurrentSection]);

  const { can } = useCan();

  // ----- local states -----

  const buttonData = [
    can(32)
      ? {
          id: 1,
          text: 'Add New User',
          icon: <AddUserIcon />,
          onClick: openAddNewUser,
        }
      : {},
    can(33)
      ? {
          id: 2,
          text: 'Manage Users',
          icon: <ManageUsersIcon />,
          onClick: openManageUsers,
        }
      : {},
    can(44)
      ? {
          id: 3,
          text: 'Manage Roles',
          icon: <ManageRolesIcon />,
          onClick: openManageRoles,
        }
      : {},
    can(46)
      ? {
          id: 4,
          text: 'Store Settings',
          icon: <StoreSettingsIcon />,
          onClick: openBusinessInfo,
        }
      : {},
    can([48, 49, 50, 51, 52, 53])
      ? {
          id: 5,
          text: 'Messaging Notifications',
          icon: <ManageNotificationsIcon />,
          onClick: openManageNotifications,
        }
      : {},
    can([54, 55, 56])
      ? {
          id: 6,
          text: 'Customer Settings',
          icon: <CustomerSettingsIcon />,
          onClick: openCloseCustomerSettings,
        }
      : {},
  ];

  return (
    <ModalWindow
      top={0}
      positionFixed
      zIndex={openCustomerSettingsFromConsentWindow ? 200 : undefined}
    >
      <ModalContainer marginTop={14} width={65.416667}>
        <ModalContainerTitle
          title="Settings"
          closeWindowFunction={() => {
            if (openCustomerSettingsFromConsentWindow) {
              openCloseCustomerSettingsFromConsentWindow();
            }

            closeSettings();
          }}
        />
        <ModalContent>
          <ContentRow widthFull cols={3} gap={2} justifyContent="center">
            {buttonData.map((el, index) =>
              el.id ? (
                <motion.button
                  key={`${el.id * 71}settingssss${index + 13 / el.id}`}
                  onClick={el.onClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-[10.416667vw] h-[10.416667vw] rounded-[1.041667vw] border-[0.15625vw] border-[#C9EBE6] flex flex-col justify-end pb-[4vh] items-center gap-[4.027778vh] hover:bg-[#C9EBE6] transition-colors ease-in-out max-lg:w-[9rem] max-lg:h-[9rem] max-lg:rounded-2xl max-lg:pb-4 max-lg:gap-3"
                >
                  {el.icon}
                  <p className="text-[1.851852vh] font-semibold text-primaryColor max-lg:text-sm">{el.text}</p>
                </motion.button>
              ) : null,
            )}
          </ContentRow>
        </ModalContent>
        <AnimatePresence>
          {addNewUser && <AddNewUser />}
          {manageUsers && <UsersList />}
          {manageRoles && <RoleList />}
          {businessInfo && <Business />}
          {manageNotifications && <ManageNotifications />}
          {customerSettings && <Customer />}
        </AnimatePresence>
      </ModalContainer>
    </ModalWindow>
  );
}

// {/* manage integrations btn */}
// <motion.button
//   onClick={openManageIntegrations}
//   whileHover={{ scale: 1.1 }}
//   whileTap={{ scale: 0.9 }}
//   className="w-[10.416667vw] h-[10.416667vw] rounded-[1.041667vw] border-[0.15625vw] border-[#C9EBE6] flex flex-col justify-end pb-[4vh] items-center gap-[3.5vh] hover:bg-[#C9EBE6] transition-colors ease-in-out"
// >
//   <ManageIntegrationsIcon />
//   <p className="text-[1.851852vh] font-semibold text-[#00A78B]">Manage Integrations</p>
// </motion.button>
