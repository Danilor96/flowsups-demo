import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { useCallback, useEffect, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { TagList } from '&/miscellaneous/tagList/TagList';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { useSocketStore } from '@/store/socketIo';
import { Can } from '@/app/ui/auth/Can';

export function RoleList() {
  // ----- global states -----

  const { closeManageRoles } = modalWindowStore();

  const { roles, permissions } = adminDashboardStore();
  const { getRoles, getPermissions } = adminDashboardStore();

  const { updateDataWithSocket } = useSocketStore();

  const getPromisesData = useCallback(() => {
    return [getRoles(), getPermissions()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromisesData);

  // ----- local states -----

  const [permissionsByRole, setPermissionsByRole] = useState<{ id: number; name: string }[]>([]);

  const [roleIdSelected, setRoleIdSelected] = useState<number | null>(null);

  const [roleNameSelected, setRoleNameSelected] = useState('No role selected');

  const [warningMessage, setWarningMessage] = useState('');

  const [newRoleName, setNewRoleName] = useState('');
  const [createNewRole, setCreateNewRole] = useState(false);

  useEffect(() => {
    if (roleIdSelected) {
      let title = 'No role selected';

      const roleSelected = roles?.find((el) => el.id === roleIdSelected);

      if (roleSelected) {
        title = roleSelected.role;
      }

      setRoleNameSelected(title);
    }
  }, [roleIdSelected, roles]);

  const handleReturnPermissions = () => {
    if (permissions && permissions.length > 0) {
      let permissionsList = [...permissions];

      for (let i = 0; i < permissionsByRole.length; i++) {
        const permissionByRole = permissionsByRole[i];

        const exists = permissionsList.find((el) => el.id === permissionByRole.id);

        const allSelected = permissionByRole.id === 1;

        if (allSelected) {
          permissionsList = [];

          return;
        }

        if (exists) {
          permissionsList = permissionsList.filter((el) => el.id !== exists.id);
        }
      }

      return permissionsList.map((el) => ({
        id: el.id,
        name: el.permission || '',
      }));
    }

    return undefined;
  };

  const handleSelectRole = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget.dataset;

    if (id) {
      if (roles && roles.length > 0) {
        const roleSelected = roles.find((el) => el.id === parseInt(id));

        const newPermissionsByRole: { id: number; name: string }[] = [];

        if (roleSelected && permissions && permissions.length > 0) {
          const permissionsIdsFromRole = roleSelected.roles_has[0]?.permission_id;

          if (permissionsIdsFromRole && permissionsIdsFromRole.length > 0) {
            for (let i = 0; i < permissionsIdsFromRole.length; i++) {
              const permissionId = permissionsIdsFromRole[i];

              const permission = permissions.find((el) => el.id === permissionId);

              if (permission) {
                newPermissionsByRole.push({
                  id: permission.id,
                  name: permission.permission,
                });
              }
            }
          }
        }

        setPermissionsByRole(newPermissionsByRole);
      }
      setNewRoleName('');

      setRoleIdSelected(parseInt(id));
    }
  };

  const handleSelectSetPermission = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget.dataset;

    if (id) {
      setPermissionsByRole((prevState) => {
        let newState = [...prevState];

        const permissionRemoved = newState.filter((el) => el.id !== parseInt(id));

        newState = permissionRemoved;

        return newState;
      });
    }
  };

  const handleSelectPermission = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget.dataset;

    if ((!roleIdSelected && !createNewRole) || !id) {
      return;
    }

    const permissionSelected = permissions?.find((el) => el.id === parseInt(id));

    const permissionExists = permissionsByRole.find((el) => el.id === parseInt(id));

    if (parseInt(id) === 1) {
      setPermissionsByRole([
        {
          id: 1,
          name: 'All',
        },
      ]);

      return;
    }

    if (permissionSelected && !permissionExists) {
      setPermissionsByRole((prevState) => {
        const newState = [...prevState];

        newState.push({
          id: permissionSelected.id,
          name: permissionSelected.permission,
        });

        return newState;
      });
    }
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleCreateNewRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setCreateNewRole(true);

    setNewRoleName(value);

    if (value === '') {
      setCreateNewRole(false);
    }
  };

  useEffect(() => {
    if (createNewRole) {
      setRoleIdSelected(null);

      setRoleNameSelected('New Role');

      if (permissionsByRole && permissionsByRole.length > 0) {
        setPermissionsByRole([]);
      }
    } else {
      setRoleNameSelected('No role selected');

      setPermissionsByRole([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createNewRole]);

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData();

    formData.append('roleName', roleIdSelected ? roleNameSelected : newRoleName);
    formData.append('permissions', JSON.stringify(permissionsByRole));

    if (roleIdSelected) {
      const apiUrl = `/api/adminDashboard/roles/${roleIdSelected}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        permissionForFetch: 44,
        options: {
          onSuccess: () => {
            updateDataWithSocket('updateRole');
          },
        },
      });
    }

    if (createNewRole) {
      const apiUrl = `/api/adminDashboard/roles`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 45,
        options: {
          onSuccess: () => {
            updateDataWithSocket('updateRole');

            setCreateNewRole(false);
            setNewRoleName('');
          },
        },
      });
    }
  };

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      const formData = new FormData();

      const apiUrl = `/api/adminDashboard/roles/${roleIdSelected}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'DELETE',
        permissionForFetch: 45,
        options: {
          onSuccess: () => {
            updateDataWithSocket('updateRole');

            setRoleIdSelected(null);

            setRoleNameSelected('No role selected');

            setPermissionsByRole([]);
          },
        },
      });

      setWarningMessage('');
    } else {
      setWarningMessage('');
    }
  };

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer marginTop={7.592593} width={86.510417}>
        <ModalContainerTitle title="Manage Roles" closeWindowFunction={closeManageRoles} />
        <ModalContent
          loading={loading || loadingFetch}
          minHeight={69}
          decisionMessage={warningMessage}
          onDecision={handleDecision}
          loadingConfirmation={loadingFetch}
        >
          <span className="w-full flex flex-row gap-[0.7vw] justify-between">
            <Paragraph color="#00a78b" fontSize={2} fontWeight={600}>
              Roles
            </Paragraph>
            <Can requiredPermission={45}>
              <aside className="w-fit flex flex-row gap-[0.5vw]">
                <Paragraph color="#00a78b" fontSize={2} fontWeight={600}>
                  Create New Role:
                </Paragraph>
                <input
                  type="text"
                  name=""
                  id=""
                  value={newRoleName}
                  onChange={handleCreateNewRole}
                  disabled={loadingFetch}
                  className="w-fit h-fit px-[0.2vw] text-primaryColor text-[2.3vh] border border-primaryColor outline-none disabled:bg-secondaryColor"
                />
              </aside>
            </Can>
          </span>
          <TagList
            height={20}
            onClick={handleSelectRole}
            buttonItems={
              (roles &&
                roles.length > 0 &&
                roles
                  ?.filter((el) => el.id !== 1)
                  .map((el) => ({
                    id: el.id,
                    name: el.role,
                    bgColor: el.id === roleIdSelected ? '#00a78b' : undefined,
                    nameColor: el.id === roleIdSelected ? '#FFF' : undefined,
                  }))) ||
              undefined
            }
            itemButtonNoCancelIcon
            loading={loadingFetch}
          />
          <ButtonContainer marginTop={2.5} justify="space-between" widthFull>
            <aside>
              <span className="w-fit flex flex-row gap-[0.7vw]">
                <Paragraph color="#00a78b" fontSize={2} fontWeight={600}>
                  Permissions Granted to:
                </Paragraph>
                <input
                  type="text"
                  name=""
                  id=""
                  value={roleNameSelected}
                  onChange={(e) => {
                    if (roleIdSelected) {
                      setRoleNameSelected(e.currentTarget.value);
                    }
                  }}
                  disabled={loadingFetch}
                  className="w-fit h-fit px-[0.2vw] text-primaryColor text-[2.3vh] border border-primaryColor outline-none disabled:bg-secondaryColor"
                />
              </span>
              <TagList
                width={35}
                height={25}
                onClick={handleSelectSetPermission}
                items={permissionsByRole}
                loading={loadingFetch}
              />
              <FieldErrorMessage
                name="permissions"
                fieldErrors={fieldErrors}
                fontSize={2}
                positionStatic
              />
              <FieldErrorMessage
                name="roleName"
                fieldErrors={fieldErrors}
                fontSize={2}
                positionStatic
              />
            </aside>
            <aside>
              <TagList
                width={35}
                height={25}
                onClick={handleSelectPermission}
                buttonItems={handleReturnPermissions()}
                itemButtonNoCancelIcon
                searchableItems
                title="Permissions List"
                loading={loadingFetch}
              />
            </aside>
          </ButtonContainer>
          <ButtonContainer marginTop={2} widthFull justify="right" gap={2}>
            {roleIdSelected && roleIdSelected > 6 && (
              <Can requiredPermission={45}>
                <Button
                  backgroundColor="#F00"
                  identity="delete"
                  textColor="#FFF"
                  buttonText="Delete"
                  buttonTextSize={2}
                  disabled={loadingFetch || (!roleIdSelected && !createNewRole)}
                  onClick={() =>
                    setWarningMessage(
                      `Are you sure you want to delete the role ${roleNameSelected}?`,
                    )
                  }
                />
              </Can>
            )}
            <Button
              backgroundColor="#00a78b"
              identity="save"
              textColor="#FFF"
              buttonText="Save"
              buttonTextSize={2}
              disabled={loadingFetch || (!roleIdSelected && !createNewRole)}
              onClick={handleSave}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
