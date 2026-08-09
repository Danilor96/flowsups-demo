import { Button } from '&/buttons/Button';
import { Input } from '&/inputs/Input';
import { Loader } from '&/miscellaneous/loader/Loader';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { BorderedContent } from '@/app/ui/modalWindowsStructure/BorderedContent';
import { ConfirmNotification } from '@/app/ui/notifications/Notification';
import { messagesStore } from '@/store/adminDashboard';
import { useState, useEffect } from 'react';

interface AvailableNumber {
  phoneNumber: string;
  friendlyName: string;
}

interface AddNewNumberModalProps {
  openCloseModal: () => void;
  fetchRegisteredNumber: () => Promise<void>;
}

const AddNewNumberModal = ({ openCloseModal, fetchRegisteredNumber }: AddNewNumberModalProps) => {
  const { messages, setMessages } = messagesStore();

  const [loader, setLoader] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addNumberConfirmationMessage, setAddNumberConfirmationMessage] = useState('');
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAvailableNumbers = async (areaCode?: string) => {
    setLoader(true);
    try {
      const url = areaCode
        ? `/api/settings/voiceAndEmails/available-numbers?areaCode=${areaCode}`
        : '/api/settings/voiceAndEmails/available-numbers';
      const response = await fetch(url, {
        method: 'GET',
      });
      const data = await response.json();
      if (!response.ok || data.serverError || data.error) {
        throw new Error(data.serverError || data.error || 'Failed to fetch available numbers');
      }
      setAvailableNumbers(data);
    } catch (error: any) {
      setAvailableNumbers([]);
      setMessages(`${error.message}`);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchAvailableNumbers();
  }, []);

  const handleSearch = () => {
    fetchAvailableNumbers(searchTerm);
  };

  const handleAddNumber = (phoneNumber: string, friendlyName: string) => {
    setSelectedNumber(phoneNumber);
    setAddNumberConfirmationMessage(`Are you sure you want to add ${friendlyName}?`);
  };

  const handleAddNumberDecision = async (isYes: boolean) => {
    if (!isYes) {
      setAddNumberConfirmationMessage('');
      return setSelectedNumber(null);
    }

    try {
      setAddLoading(true);
      const response = await fetch('/api/settings/voiceAndEmails/registered-numbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: selectedNumber }),
      });
      const data = await response.json();
      if (!response.ok || data.serverError || data.error) {
        throw new Error(data.serverError || data.error || 'Failed to add number');
      }
      if(data.successMessage){
        setMessages(undefined,data.successMessage);
        fetchRegisteredNumber();
      }
      // await fetchAvailableNumbers();
      setSelectedNumber(null);
      setAddNumberConfirmationMessage('');
      setAddLoading(false);
      openCloseModal();
    } catch (error: any) {
      setMessages(error.message || 'Error adding number');
      setAddLoading(false);
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
        <ModalContainerTitle title="Add New Number" closeWindowFunction={openCloseModal} />
        <ModalContent widthFull height={71}>
          <ContentRow widthFull cols={2} gap={1} alignItems="flex-end" justifyContent="flex-start">
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Area Code"
              type="text"
              name="search"
              label="Search"
              width={12}
            />
            <Button
              backgroundColor="#00A78B"
              identity="search"
              buttonText="Search"
              textColor="#fff"
              onClick={handleSearch}
              width={6}
            />
          </ContentRow>
          {/* <h2 className="text-lg text-gray-500 font-semibold mb-4">Available Numbers</h2> */}
          {availableNumbers.length === 0 && !loader && (
            <p className="text-gray-500">No available numbers found for the selected criteria.</p>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-3 justify-center w-full gap-3 mt-6 pb-4 overflow-y-auto h-[50vh]">
            {availableNumbers.map(num => (
              <span
                key={num.phoneNumber}
                onClick={() => handleAddNumber(num.phoneNumber, num.friendlyName)}
                className="font-medium hover:cursor-pointer text-gray-800 hover:text-primaryColor"
              >
                {num.friendlyName}
              </span>
            ))}
            {addNumberConfirmationMessage && (
              <ConfirmNotification
                notiMessage={addNumberConfirmationMessage}
                onDecision={handleAddNumberDecision}
                loading={addLoading}
              />
            )}
          </div>
          {loader && <Loader zIndex={200} />}
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
};

export default AddNewNumberModal;
