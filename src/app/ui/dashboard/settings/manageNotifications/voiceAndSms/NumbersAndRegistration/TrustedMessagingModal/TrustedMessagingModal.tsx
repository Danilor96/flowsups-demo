import { Button } from '&/buttons/Button';
import { Input } from '&/inputs/Input';
import { Loader } from '&/miscellaneous/loader/Loader';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { SelectDropIcon } from '@/app/ui/icons/Icons';
import { DropdownContent } from '@/app/ui/modalWindowsStructure/dropdownContent/DropdownContent';
import { messagesStore } from '@/store/adminDashboard';
import { useState } from 'react';

const TrustedMessagingModal = ({ openCloseModal }: { openCloseModal: () => void }) => {
  const { messages, setMessages } = messagesStore();
  const [loader, setLoader] = useState(false);
  const [inputs, setInputs] = useState({
    ein: '',
    legalBusinessName: '',
    entityType: '',
    businessAddress: '',
    email: '',
    websiteUrl: '',
    dealershipName: '',
    firstName: '',
    lastName: '',
    authEmail: '',
    phone: '',
    jobTitle: '',
    position: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setInputs(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log(inputs);
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
      <ModalContainer marginTop={10} width={70} height={80}>
        <ModalContainerTitle title="Trusted Messaging" closeWindowFunction={openCloseModal} />
        <ModalContent widthFull height={71} overflowY>
          <div className="flex flex-col gap-4">
            <div className="text-xs text-gray-500 mt-1 flex gap-5">
              <p>
                Trusted Messaging: <span className=" text-red-700 bg-red-100 rounded-xl px-2 py-1">NOT APPROVED</span>
              </p>
              <p>
                Trusted Calling: <span className=" text-red-700 bg-red-100 rounded-xl px-2 py-1">NOT APPROVED</span>
              </p>
            </div>
            <ContainerSection title="Business Information">
              <ContentRow cols={2} gap={1.09375}>
                <Input
                  label="Employment Indentification Number (EIN)"
                  name="ein"
                  type="text"
                  value={inputs.ein}
                  onChange={handleChange}
                  width={20}
                />
                <Input
                  label="Exact Legal Business Name"
                  name="legalBusinessName"
                  type="text"
                  value={inputs.legalBusinessName}
                  onChange={handleChange}
                  width={20}
                />
              </ContentRow>
              <ContentRow cols={2} gap={1.09375} marginTop={2}>
                <Input
                  label="Entity Type"
                  name="entityType"
                  type="select"
                  value={inputs.entityType}
                  onChange={handleChange}
                  width={20}
                  options={[
                    { value: 1, option: 'Type 1' },
                    { value: 2, option: 'Type 2' },
                  ]}
                />
                <Input
                  label="Exact Business Mailing Address"
                  name="businessAddress"
                  type="text"
                  value={inputs.businessAddress}
                  onChange={handleChange}
                  width={20}
                />
              </ContentRow>
              <ContentRow cols={3} gap={1.09375} marginTop={2}>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={inputs.email}
                  onChange={handleChange}
                  widthFull
                  width={20}
                />
                <Input
                  label="Website URL"
                  name="websiteUrl"
                  type="text"
                  value={inputs.websiteUrl}
                  onChange={handleChange}
                  widthFull
                  width={20}
                />
                <Input
                  label="Dealership Name on Website"
                  name="dealershipName"
                  type="text"
                  value={inputs.dealershipName}
                  onChange={handleChange}
                  width={20}
                  widthFull
                />
              </ContentRow>
            </ContainerSection>
            <ContainerSection title="Authorized Representative Information">
              <ContentRow cols={3} gap={1.09375}>
                <Input
                  label="First Name"
                  name="firstName"
                  type="text"
                  value={inputs.firstName}
                  onChange={handleChange}
                  width={20}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  type="text"
                  value={inputs.lastName}
                  onChange={handleChange}
                  width={20}
                />
                <Input
                  label="Email"
                  name="authEmail"
                  type="email"
                  value={inputs.authEmail}
                  onChange={handleChange}
                  width={20}
                />
              </ContentRow>
              <ContentRow cols={3} gap={1.09375} marginTop={2}>
                <Input label="Phone" name="phone" type="text" value={inputs.phone} onChange={handleChange} width={20} />
                <Input
                  label="Exact Job Title"
                  name="jobTitle"
                  type="text"
                  value={inputs.jobTitle}
                  onChange={handleChange}
                  width={20}
                />
                <Input
                  label="Position"
                  name="position"
                  type="select"
                  value={inputs.position}
                  onChange={handleChange}
                  width={20}
                  options={[
                    { value: 1, option: 'Position 1' },
                    { value: 2, option: 'Position 2' },
                  ]}
                />
              </ContentRow>
            </ContainerSection>
          </div>
          <ContentRow cols={1} gap={1.09375} marginTop={4} widthFull justifyContent="flex-end">
            <Button
              identity="save"
              buttonText="save"
              onClick={handleSubmit}
              backgroundColor="#00A78B"
              textColor="#FFF"
              width={10}
            />
          </ContentRow>
          {loader && <Loader zIndex={200} />}
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
};

const ContainerSection = ({ children, title }: { children: React.ReactNode; title: string }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="w-full flex flex-col border border-[#C9EBE6] rounded-xl overflow-hidden">
      <button
        className="h-[20%] bg-[#C9EBE6] flex items-center justify-between px-4 py-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h6 className="text-[#00A78B] text-lg font-semibold">{title}</h6>
        <SelectDropIcon color="#00A78B" />

        {/* </div> */}
      </button>
      <div
        className={`h-[80%] px-6 py-4 transition-all duration-300 opacity-${isOpen ? '100' : '0'} ${
          isOpen ? 'block ' : 'hidden'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default TrustedMessagingModal;
