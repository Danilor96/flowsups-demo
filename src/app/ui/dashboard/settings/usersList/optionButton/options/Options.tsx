import { Loader } from '&/miscellaneous/loader/Loader';
import { ConfirmNotification } from '&/notifications/Notification';
import { Can } from '@/app/ui/auth/Can';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import {
  adminDashboardStore,
  modalWindowStore,
  singleUserDataStore,
  userPermissionAllowedStore,
} from '@/store/adminDashboard';
import { useSocketStore } from '@/store/socketIo';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export function Options({
  userId,
  userName,
  onClick,
}: {
  userId: number;
  userName: string;
  onClick: () => void;
}) {
  // ----- global states -----
  const session = useSession();
  const userLoggedId = session.data?.user.user_has[0].role_id;

  const { getSingleUserData } = singleUserDataStore();

  const { openSingleUser } = modalWindowStore();

  const { setSelectedUserSystemAccess } = adminDashboardStore();

  const { returnPermission } = userPermissionAllowedStore();

  const { openInNewTab } = modalWindowStore();

  const { updateDataWithSocket } = useSocketStore();

  // ----- local states -----

  const [loading, setLoading] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'edit') {
      if (openInNewTab) {
        window.open(`/dashboard/userDetail-${userId}`);

        return;
      }

      setLoading(true);

      setSelectedUserSystemAccess(userId);

      await getSingleUserData(userId.toString()).then(() => {
        openSingleUser();
        onClick();
      });

      setLoading(true);
    }

    if (identity === 'delete') {
      setShowConfirmation(!showConfirmation);
    }
  };

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleDecision = async (e: boolean) => {
    if (e) {
      const apiUrl = `/api/adminDashboard/users/${userId}`;

      await makeAsyncFetch({
        apiUrl,
        method: 'DELETE',
        permissionForFetch: 35,
        options: {
          onSuccess: () => {
            updateDataWithSocket('usersList');
          },
        },
      });

      setShowConfirmation(false);
    } else {
      setShowConfirmation(false);
    }
  };

  return (
    <aside className="absolute top-0 z-10 right-[2.5vw] w-[10.833333vw] h-fit flex flex-col bg-white rounded-[0.520833vw] text-[2vh] font-medium text-[#00A78B] shadow-crmFormShadow overflow-hidden">
      {showConfirmation && (
        <ConfirmNotification
          notiMessage={`Are you sure you want to delete: `}
          alterNotiMessage={userName}
          alterNotiMessageColor="#F00"
          loading={loading || loadingFetch}
          onDecision={handleDecision}
        />
      )}
      <Can requiredPermission={34}>
        <button
          onClick={handleButton}
          className="w-full h-[6vh] hover:bg-[#C9EBE6] transition-colors"
          data-identity="edit"
        >
          Edit
        </button>
      </Can>
      <Can requiredPermission={35}>
        <button
          onClick={handleButton}
          className="w-full h-[6vh] hover:bg-[#C9EBE6] transition-colors"
          data-identity="delete"
        >
          Delete
        </button>
      </Can>
      {loading && <Loader />}
    </aside>
  );
}
