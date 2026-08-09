import { HorizontalLine } from '&/miscellaneous/separators/HorizontalLine';
import { Button } from '&/buttons/Button';
import { creditAppPaginationStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useCallback, useEffect } from 'react';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { Loader } from '&/miscellaneous/loader/Loader';
import { creditAppStore } from '@/store/creditApp';

export function HeaderNavigation() {
  // ----- global states -----

  const { currentPage, creditAppNav } = creditAppPaginationStore();
  const { setCurrentPage, getCreditAppNavigation } = creditAppPaginationStore();

  const { singleCLientData } = singleCLientDataStore();

  const { creditApp, pagesAvailability } = creditAppStore();

  const getPromiseData = useCallback(() => {
    return [getCreditAppNavigation(singleCLientData?.id || 0)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData, [singleCLientData]);

  // ----- local states -----

  const addressPageAvailability = () => {
    let next = false;

    const {
      cashdown,
      consent,
      dateOfBirth,
      expirationDate,
      gender,
      idNumber,
      idState,
      idType,
      issueDate,
      noId,
      ssn,
    } = creditApp.start;

    const firstBlock = ssn && dateOfBirth && cashdown && gender ? true : false;
    const secondBlock =
      firstBlock && expirationDate && idNumber && issueDate && idType ? true : false;
    const thirdBlock = secondBlock && idState ? true : false;

    if (noId) {
      if (firstBlock) {
        next = true;
      }
    }

    if (!noId) {
      if (idType !== 3) {
        if (secondBlock) {
          next = true;
        }
      }

      if (idType === 3) {
        if (thirdBlock) {
          next = true;
        }
      }
    }

    return next;
  };

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (creditAppNav) {
      if (identity === 'start') {
        setCurrentPage(identity);

        return;
      }

      if (identity === 'address' && addressPageAvailability()) {
        setCurrentPage(identity);

        return;
      }

      if (
        identity === 'status' &&
        creditAppNav.nextToEmploymentStatus &&
        creditAppNav.nextToAddress
      ) {
        setCurrentPage(identity);

        return;
      }

      if (
        identity === 'references' &&
        creditAppNav.nextToReferences &&
        creditAppNav.nextToEmploymentStatus &&
        creditAppNav.nextToAddress
      ) {
        setCurrentPage(identity);

        return;
      }
    }
  };

  const navigationButtonsInfo = [
    {
      id: 1,
      identity: 'start',
      page: 1,
      buttonText: 'Start',
    },
    {
      id: 2,
      identity: 'address',
      page: 2,
      buttonText: 'Address',
    },
    {
      id: 3,
      identity: 'status',
      page: 3,
      buttonText: 'Employment Status',
    },
    {
      id: 4,
      identity: 'references',
      page: 4,
      buttonText: 'References',
    },
  ];

  return (
    <aside className="relative w-full h-[7.314815vh] flex justify-center items-center bg-[#00A78B4F]">
      <section className="w-fit h-[4vh] flex flex-row justify-center items-center gap-[0.78125vw]">
        {navigationButtonsInfo.map((el, index) => (
          <>
            <Button
              backgroundColor={currentPage === el.page ? '#00A78B' : ''}
              onClick={handleButton}
              textColor={currentPage === el.page ? '#FFF' : '#00A78B'}
              identity={el.identity}
              buttonText={el.buttonText}
              widthFitContent
              buttonTextSize={2}
            />
            {index !== 3 && (
              <HorizontalLine width={8.906771} height={0.277778} lineColor="#00A78B" />
            )}
          </>
        ))}
      </section>
      {loading && <Loader />}
    </aside>
  );
}
