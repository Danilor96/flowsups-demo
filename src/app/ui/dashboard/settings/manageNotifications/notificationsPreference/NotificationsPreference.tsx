import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { adminDashboardStore, messagesStore } from '@/store/adminDashboard';
import { useCallback, useState } from 'react';
import { TagList } from '&/miscellaneous/tagList/TagList';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { Button } from '&/buttons/Button';
import { useSocketStore } from '@/store/socketIo';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';

export function NotificationsPreference() {
  // ----- global states -----

  const { users, eventsTypes, notificationPreference, eventCategories } = adminDashboardStore();
  const { getUsers, getEventsTypes, getNotificationsPreference, getEventCategories } =
    adminDashboardStore();

  const { updateDataWithSocket } = useSocketStore();

  const { setMessages } = messagesStore();

  const getPromisesData = useCallback(() => {
    return [getUsers(), getEventsTypes(), getNotificationsPreference(), getEventCategories()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error } = useLoadingGetData(getPromisesData);

  // ----- local states -----

  const [eventIdSelected, setEventIdSelected] = useState<number | null>(null);
  const [usersByEvent, setUsersByEvents] = useState<{ id: number; name: string }[]>([]);

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { buttonitemidentity, id, identity } = e.currentTarget.dataset;

    if (buttonitemidentity === 'eventFromList' && id) {
      handleEventPickedWithUsers(parseInt(id));

      setEventIdSelected(parseInt(id));
    }

    if (buttonitemidentity === 'userFromList' && id) {
      handleUserPicked(parseInt(id));
    }

    if (identity === 'removeUser' && id) {
      handleRemoveUserFromEvent(parseInt(id));
    }

    if (identity === 'addall') {
      handleAddAllUsers();
    }

    if (identity === 'removeall') {
      handleRemoveAll();
    }

    if (identity === 'managers') {
      handleManagers();
    }

    if (identity === 'bdc') {
      handleBdc();
    }

    if (identity === 'sales') {
      handleSalesRep();
    }

    if (identity === 'default') {
      handleSetDefault();
    }

    if (identity === 'save') {
      const formData = new FormData();

      formData.append('usersByEvent', JSON.stringify(usersByEvent));

      if (eventIdSelected) formData.append('eventIdSelected', eventIdSelected.toString());

      const apiUrl = '/api/adminDashboard/notificationsPreferences';

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 53,
        options: {
          onSuccess: () => {
            updateDataWithSocket('notificationsPreferences');
          },
        },
      });
    }
  };

  const handleUserPicked = (userId: number) => {
    if (!eventIdSelected) {
      setMessages('You have to pick an event first');

      return;
    }

    const userSelected = users?.find((el) => el.id === userId);

    const userExists = usersByEvent.find((el) => el.id === userId);

    if (userSelected && !userExists) {
      setUsersByEvents((prevState) => {
        const newState = [...prevState];

        newState.push({
          id: userSelected.id,
          name: `${userSelected.name || ''} ${userSelected.last_name || ''}${
            userSelected.username ? ` - ${userSelected.username}` : ''
          }`,
        });

        return newState;
      });
    }
  };

  const handleEventPickedWithUsers = (eventId: number) => {
    const eventSelected = notificationPreference?.find((el) => el.event_type_id === eventId);

    const newUsersByEvent: { id: number; name: string }[] = [];

    if (eventSelected) {
      const usersOfTheEvent = users?.filter((el) => eventSelected.user_ids.includes(el.id));

      if (usersOfTheEvent) {
        for (let i = 0; i < usersOfTheEvent.length; i++) {
          const user = usersOfTheEvent[i];

          newUsersByEvent.push({
            id: user.id,
            name: `${user.name || ''} ${user.last_name || ''}${
              user.username ? ` - ${user.username}` : ''
            }`,
          });
        }
      }
    }

    setUsersByEvents(newUsersByEvent);
  };

  const handleEventTitle = () => {
    let title = 'No event selected';

    const eventSelected = eventsTypes?.find((el) => el.id === eventIdSelected);

    if (eventSelected) {
      title = eventSelected.type.replace(
        eventSelected.type[0],
        eventSelected.type[0].toUpperCase(),
      );
    }

    return title;
  };

  const handleRemoveUserFromEvent = (userId: number) => {
    setUsersByEvents((prevState) => {
      let newState = [...prevState];

      const userRemoved = newState.filter((el) => el.id !== userId);

      newState = userRemoved;

      return newState;
    });
  };

  const handleReturnUsers = () => {
    if (users && users.length > 0) {
      let usersList = [...users];

      for (let i = 0; i < usersByEvent.length; i++) {
        const userByEvent = usersByEvent[i];

        const exists = usersList.find((el) => el.id === userByEvent.id);

        if (exists) {
          usersList = usersList.filter((el) => el.id !== exists.id);
        }
      }

      return usersList.map((el) => ({
        id: el.id,
        name: `${el.name || ''} ${el.last_name || ''}${el.username ? ` - ${el.username}` : ''}`,
      }));
    }

    return undefined;
  };

  const handleAddAllUsers = () => {
    if (!eventIdSelected) {
      setMessages('You have to pick an event first');

      return;
    }

    if (users) {
      const allUsers: typeof usersByEvent = [];

      for (let i = 0; i < users.length; i++) {
        const user = users[i];

        allUsers.push({
          id: user.id,
          name: `${user.name || ''} ${user.last_name || ''}${
            user.username ? ` - ${user.username}` : ''
          }`,
        });
      }

      setUsersByEvents(allUsers);
    }
  };

  const handleRemoveAll = () => {
    setUsersByEvents([]);
  };

  const handleManagers = () => {
    if (!eventIdSelected) {
      setMessages('You have to pick an event first');

      return;
    }

    if (users) {
      const managerUsers: typeof usersByEvent = [];

      const managerRoles = [3, 4];

      for (let i = 0; i < users.length; i++) {
        const user = users[i];

        const userExists = usersByEvent.find((el) => el.id === user.id);

        if (managerRoles.includes(user.user_has[0].role.id) && !userExists) {
          managerUsers.push({
            id: user.id,
            name: `${user.name || ''} ${user.last_name || ''}${
              user.username ? ` - ${user.username}` : ''
            }`,
          });
        }
      }

      setUsersByEvents((prevState) => {
        const newState = [...prevState];

        for (let i = 0; i < managerUsers.length; i++) {
          const user = managerUsers[i];

          newState.push(user);
        }

        return newState;
      });
    }
  };

  const handleBdc = () => {
    if (!eventIdSelected) {
      setMessages('You have to pick an event first');

      return;
    }

    if (users) {
      const bdcUsers: typeof usersByEvent = [];

      const bdcRoles = [5];

      for (let i = 0; i < users.length; i++) {
        const user = users[i];

        const userExists = usersByEvent.find((el) => el.id === user.id);

        if (bdcRoles.includes(user.user_has[0].role.id) && !userExists) {
          bdcUsers.push({
            id: user.id,
            name: `${user.name || ''} ${user.last_name || ''}${
              user.username ? ` - ${user.username}` : ''
            }`,
          });
        }
      }

      setUsersByEvents((prevState) => {
        const newState = [...prevState];

        for (let i = 0; i < bdcUsers.length; i++) {
          const user = bdcUsers[i];

          newState.push(user);
        }

        return newState;
      });
    }
  };

  const handleSalesRep = () => {
    if (!eventIdSelected) {
      setMessages('You have to pick an event first');

      return;
    }

    if (users) {
      const salesRepUsers: typeof usersByEvent = [];

      const salesRepRoles = [6];

      for (let i = 0; i < users.length; i++) {
        const user = users[i];

        const userExists = usersByEvent.find((el) => el.id === user.id);

        if (salesRepRoles.includes(user.user_has[0].role.id) && !userExists) {
          salesRepUsers.push({
            id: user.id,
            name: `${user.name || ''} ${user.last_name || ''}${
              user.username ? ` - ${user.username}` : ''
            }`,
          });
        }
      }

      setUsersByEvents((prevState) => {
        const newState = [...prevState];

        for (let i = 0; i < salesRepUsers.length; i++) {
          const user = salesRepUsers[i];

          newState.push(user);
        }

        return newState;
      });
    }
  };

  const handleSetDefault = () => {
    const currentNoti = notificationPreference?.find((el) => el.event_type_id === eventIdSelected);

    if (currentNoti) {
      const defaultUsers: typeof usersByEvent = [];

      for (let i = 0; i < currentNoti.user_ids.length; i++) {
        const id = currentNoti.user_ids[i];

        const user = users?.find((el) => el.id === id);

        defaultUsers.push({
          id,
          name: `${user?.name || ''} ${user?.last_name || ''}${
            user?.username ? ` - ${user?.username}` : ''
          }`,
        });
      }

      setUsersByEvents(defaultUsers);
    }
  };

  const buttonsData = [
    {
      key: 1,
      text: 'Add All',
      identity: 'addall',
    },
    {
      key: 2,
      text: 'Remove All',
      identity: 'removeall',
    },
    {
      key: 3,
      text: 'Managers',
      identity: 'managers',
    },
    {
      key: 4,
      text: 'Bdc',
      identity: 'bdc',
    },
    {
      key: 5,
      text: 'Sales Rep',
      identity: 'sales',
    },
    {
      key: 6,
      text: 'Set Default',
      identity: 'default',
    },
  ];

  return (
    <ModalContent>
      <BorderedContent loading={loading} positionRelative>
        <TagList
          height={40}
          onClick={handleButton}
          buttonItemIdentity="eventFromList"
          itemButtonNoCancelIcon
          loading={loadingFetch}
          searchableItems
          title="Events With Notifications"
          buttonItems={eventsTypes?.map((el) => ({
            id: el.id,
            name: el.type.replace(el.type[0], el.type[0].toUpperCase()),
            bgColor: el.id === eventIdSelected ? '#00a78b' : undefined,
            nameColor: el.id === eventIdSelected ? '#FFF' : undefined,
            category: el.category_id,
          }))}
          setCategories={
            eventCategories && eventCategories.length > 0
              ? eventCategories.map((el) => ({
                  category: el.category,
                  value: el.id,
                }))
              : undefined
          }
        />
        <ButtonContainer marginTop={2} widthFull justify="space-between">
          <article className="relative">
            <TagList
              height={30}
              width={30}
              identity="removeUser"
              onClick={handleButton}
              items={usersByEvent}
              title={handleEventTitle()}
              loading={loadingFetch}
            />
            <FieldErrorMessage
              name="eventIdSelected"
              fieldErrors={fieldErrors}
              top={33}
              fontSize={2}
            />
          </article>
          <article className="flex flex-row gap-[1vw]">
            <aside>
              <TagList
                height={40}
                width={30}
                onClick={handleButton}
                buttonItemIdentity="userFromList"
                itemButtonNoCancelIcon
                loading={loadingFetch}
                buttonItems={handleReturnUsers()}
                title="Users"
              />
              <FieldErrorMessage
                name="usersByEvent"
                fieldErrors={fieldErrors}
                top={43}
                fontSize={2}
              />
            </aside>
            <aside className="flex flex-col gap-[1vh] mt-auto mb-auto">
              {buttonsData.map((el, index) => (
                <button
                  key={`userssss${el.key + index}`}
                  data-identity={el.identity}
                  disabled={loadingFetch}
                  className="w-[6vw] flex justify-center items-center text-[2vh] text-primaryColor border border-primaryColor rounded-md py-[0.5vh] hover:bg-primaryColor hover:text-white transition-colors"
                  onClick={handleButton}
                >
                  {el.text}
                </button>
              ))}
            </aside>
          </article>
        </ButtonContainer>
        <ButtonContainer marginTop={2} widthFull justify="right">
          <Button
            backgroundColor="#00a78b"
            identity="save"
            textColor="#FFF"
            buttonText="Save"
            onClick={handleButton}
          />
        </ButtonContainer>
      </BorderedContent>
    </ModalContent>
  );
}
