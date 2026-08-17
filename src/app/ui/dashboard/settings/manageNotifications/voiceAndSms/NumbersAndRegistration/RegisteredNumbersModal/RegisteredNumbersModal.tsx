import { Button } from '&/buttons/Button';
import { Input } from '&/inputs/Input';
import { Loader } from '&/miscellaneous/loader/Loader';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { TrashDeleteIcon } from '@/app/ui/icons/Icons';
import { BorderedContent } from '@/app/ui/modalWindowsStructure/BorderedContent';
import { useState, useEffect } from 'react';
import AddNewNumberModal from './AddNewNumberModal';
import { messagesStore } from '@/store/adminDashboard';
import { voiceAndSmsStore } from '@/store/notificationsSettings';

interface TwilioNumber {
  id: number;
  twilio_sid: string;
  phone_number: string;
  friendly_name: string;
  business_id: number;
  is_publishing_number: boolean;

  // from Twilio aPi
  // sid: string;
  // phoneNumber: string;
  // friendlyName: string;
}

const RegisteredNumbersModal = ({ openCloseModal }: { openCloseModal: () => void }) => {
  const { getVoiceAndEmailsData } = voiceAndSmsStore();

  const [loader, setLoader] = useState(false);
  const [activateLoader, setActivateLoader] = useState(false);
  const { messages, setMessages } = messagesStore();
  const [registeredNumbers, setRegisteredNumbers] = useState<TwilioNumber[]>([]);
  const [isAddNewNumberModalOpen, setIsAddNewNumberModalOpen] = useState(false);

  const fetchNumbers = async () => {
    setLoader(true);
    try {
      const response = await fetch('/api/settings/voiceAndEmails/registered-numbers', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch registered numbers');
      }
      const data = await response.json();
      setRegisteredNumbers(data);
    } catch (error: any) {
      console.error('Error fetching numbers:', error);
      setMessages(error.message || 'Error fetching numbers');
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, []);

  const handleAddNumberClick = () => {
    setIsAddNewNumberModalOpen(true);
  };

  const closeAddNewNumberModal = () => {
    setIsAddNewNumberModalOpen(false);
    // Here you might want to refetch the registered numbers
  };

  const handleDeleteNumber = (sid: string) => {
    // Implement logic to delete a number via API
    console.log('Deleting number with SID:', sid);
    // After successful API call, refetch numbers or update state
  };

  const activatePhoneForPublishing = async (phoneId: number) => {
    try {
      setActivateLoader(true);
      const response = await fetch(`/api/settings/voiceAndEmails/registered-numbers/${phoneId}/activate`, {
        method: 'PUT',
      });
      const data = await response.json();
      if (data.successMessage) {
        setMessages(undefined, data.successMessage);
        await fetchNumbers();
        getVoiceAndEmailsData();
      } else {
        setMessages(data.serverError || data.error || 'Failed to activate number');
      }
    } catch (error: any) {
      setMessages(error.message || 'Error activating number');
    } finally {
      setActivateLoader(false);
    }
  };

  return (
    <ModalWindow
      top={0}
      fullScreen
      positionFixed
      minSizeFull
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
    >
      <ModalContainer marginTop={10} width={50} height={80}>
        <ModalContainerTitle title="Phone Numbers" closeWindowFunction={openCloseModal} />
        <ModalContent widthFull height={71}>
          {/* Formulario de Entrada */}
          <ContentRow widthFull cols={1} gap={4} alignItems="" justifyContent="flex-end">
            <Button
              backgroundColor="#00A78B"
              identity="add"
              buttonText="Add New Number"
              textColor="#fff"
              widthFitContent
              onClick={handleAddNumberClick}
            />
          </ContentRow>
          <ContentRow widthFull cols={1} gap={4} alignItems="center" justifyContent="start">
            <div className="w-full flex flex-col ">
              {/* Lista de Números Registrados */}

              <h2 className="text-lg text-gray-500 font-semibold mb-4">Registered Phone Numbers</h2>
              {registeredNumbers.length === 0 && !loader ? (
                <p className="text-gray-500">No registered numbers found.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {registeredNumbers.map(num => (
                    <BorderedContent key={num.id + '-bc'}>
                      <div key={num.id} className="flex w-[35rem] items-center justify-between hover:cursor-pointer max-lg:w-full max-lg:flex-col max-lg:items-start max-lg:gap-3">
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-4">
                            <span className="font-semibold text-gray-800">{num.phone_number}</span>
                            {num.is_publishing_number && (
                              <span className="text-green-700 text-sm w-fit bg-green-100 rounded-xl px-2 py-1">
                                Active for Publishing
                              </span>
                            )}
                          </div>
                          {/* <span className="text-sm text-gray-600">
                            {num.friendlyName || 'System Phone # for Publishing'}
                          </span> */}
                          {/* <div className="text-xs text-gray-500 mt-1 flex gap-5">
                            <p>
                              Trusted Messaging: <span className=" text-green-700 bg-green-100 rounded-xl px-2 py-1">APPROVED</span>
                            </p>
                            <p>
                              Trusted Calling: <span className=" text-green-700 bg-green-100 rounded-xl px-2 py-1">APPROVED</span>
                            </p>
                          </div> */}
                          <div className="text-xs text-gray-500 mt-1 flex gap-5">
                            <p>
                              Trusted Messaging:{' '}
                              <span className=" text-red-700 bg-red-100 rounded-xl px-2 py-1">NOT APPROVED</span>
                            </p>
                            <p>
                              Trusted Calling:{' '}
                              <span className=" text-red-700 bg-red-100 rounded-xl px-2 py-1">NOT APPROVED</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-end">
                          {/* <Button
                            onClick={() => handleDeleteNumber(num.twilio_sid)}
                            buttonText=""
                            identity="delete"
                            textColor="#fff"
                            backgroundColor="#FFF"
                            borderColor="#fff"
                            widthFitContent
                            buttonIcon={<TrashDeleteIcon color="#FF0000" />}
                          /> */}
                          {!num.is_publishing_number && activateLoader && (
                            <div className="flex w-full h-full items-center justify-center">
                              <svg
                                className="size-5 animate-spin text-primaryColor z-[10]"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  stroke-width="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </div>
                          )}
                          {!num.is_publishing_number && !activateLoader && (
                            <Button
                              onClick={() => activatePhoneForPublishing(num.id)}
                              buttonText="Activate"
                              identity="usePhoneNumber"
                              textColor="#00A78B"
                              borderColor="#00A78B"
                              border={0.05}
                              backgroundColor="#FFF"
                              widthFitContent
                            />
                          )}
                        </div>
                      </div>
                    </BorderedContent>
                  ))}
                </div>
              )}
            </div>
          </ContentRow>
          {loader && <Loader zIndex={200} />}
        </ModalContent>
      </ModalContainer>
      {isAddNewNumberModalOpen && <AddNewNumberModal openCloseModal={closeAddNewNumberModal} fetchRegisteredNumber={fetchNumbers} />}
    </ModalWindow>
  );
};

export default RegisteredNumbersModal;
