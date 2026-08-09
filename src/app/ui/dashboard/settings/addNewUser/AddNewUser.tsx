/* eslint-disable @next/next/no-img-element */
import { adminDashboardStore, currentSectionStore, modalWindowStore } from '@/store/adminDashboard';
import { useCallback, useEffect, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { Input } from '&/inputs/Input';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { UserImage } from './userImage/UserImage';
import { Button } from '&/buttons/Button';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { useSession } from 'next-auth/react';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';

export function AddNewUser() {
  // global states
  const { data: session } = useSession();

  const userId = session?.user.id;

  const { closeAddNewUser } = modalWindowStore();

  const { roles } = adminDashboardStore();
  const { getRoles } = adminDashboardStore();

  const { getCurrentSection } = currentSectionStore();

  const { formatPhoneNumber, extractDigits } = phoneNumbersFormatStore();

  const getPromiseData = useCallback(() => {
    return [getRoles()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData);

  useEffect(() => {
    getCurrentSection('Add new user');
  }, [getCurrentSection]);

  // local states

  const [inputs, setInputs] = useState<{
    firstName: string;
    lastName: string;
    role: string;
    mobilePhone: string;
    email: string;
    password: string;
    userImage: File | undefined;
    username: string;
  }>({
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    mobilePhone: '',
    password: '',
    userImage: undefined,
    username: '',
  });

  const [fieldErrorsState, setFieldErrorsState] = useState<any>();
  const [localImageUploaded, setLocalImageUploaded] = useState<any>(undefined);

  //   handle show selected image

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localImagePath = e.target.files && e.target.files[0];

    const userImg = e.target.files && e.target.files[0] ? e.target.files[0] : undefined;

    userImg &&
      setInputs((prevState) => ({
        ...prevState,
        userImage: userImg,
      }));

    if (localImagePath) {
      const reader = new FileReader();

      reader.onload = (e) => {
        e.target && e.target.result && setLocalImageUploaded(e.target?.result);
      };

      reader.readAsDataURL(localImagePath);
    }
  };

  //   handle submit form

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleSubmitForm = async () => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(inputs)) {
      if (value) formData.append(key, value);
    }

    const apiUrl = '/api/adminDashboard/users';

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'POST',
      permissionForFetch: 32,
      options: {
        onSuccess: () => {
          setInputs({
            email: '',
            firstName: '',
            lastName: '',
            mobilePhone: '',
            password: '',
            role: '',
            username: '',
            userImage: undefined,
          });

          setLocalImageUploaded(undefined);
        },
        onFieldErrors: (fieldErrors: any) => {
          if (fieldErrorsState) {
            setFieldErrorsState({
              ...fieldErrors,
            });
            return;
          }
          setFieldErrorsState(fieldErrors);
        },
      },
    });
  };

  const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value, name } = e.target;

    if (name === 'mobilePhone') {
      const mobile = extractDigits(value);

      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: mobile,
      }));

      return;
    }

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const inputDataOne = [
    {
      id: 1,
      name: 'firstName',
      value: inputs.firstName,
      label: 'First Name',
      type: 'text',
      width: 24.583333,
      onChange: handleInputsChange,
    },
    {
      id: 2,
      name: 'lastName',
      value: inputs.lastName,
      label: 'Last Name',
      type: 'text',
      width: 24.583333,
      onChange: handleInputsChange,
    },
    {
      id: 3,
      name: 'role',
      value: inputs.role,
      label: 'Role',
      type: 'select',
      width: 15.052083,
      options: roles
        ?.filter((el) => (userId !== 1 ? el.id !== 1 : true))
        .map((el) => {
          return { value: el.id, option: el.role };
        }),
      onChange: handleInputsChange,
    },
  ];

  const inputDataTwo = [
    {
      id: 4,
      name: 'mobilePhone',
      value: formatPhoneNumber(inputs.mobilePhone),
      label: 'Mobile Phone',
      type: 'text',
      width: 24.583333,
      onChange: handleInputsChange,
    },
    {
      id: 5,
      name: 'email',
      value: inputs.email,
      label: 'Email',
      type: 'text',
      width: 24.583333,
      onChange: handleInputsChange,
    },
    {
      id: 6,
      name: 'password',
      value: inputs.password,
      label: 'Password',
      type: 'password',
      width: 24.583333,
      onChange: handleInputsChange,
    },
  ];

  const capitalWordsInputs = ['firstName', 'lastName'];

  return (
    <ModalWindow top={0}>
      <ModalContainer width={82.916667} marginTop={9.814815}>
        <ModalContainerTitle title="Add New User" closeWindowFunction={closeAddNewUser} />
        <ModalContent loading={loading || loadingFetch} height={66.5}>
          <BorderedContent overflowVisible>
            <ContentRow cols={3} gap={0} widthFull justifyContent="space-between">
              {inputDataOne.map((el, index) => (
                <Input
                  key={`${el.id * 39}adduser${index + index}`}
                  label={el.label}
                  name={el.name}
                  value={
                    capitalWordsInputs.includes(el.name) ? handlingCapitalWords(el.value) : el.value
                  }
                  type={el.type}
                  width={el.width}
                  options={el.options}
                  onChange={el.onChange}
                  fieldErrors={fieldErrorsState}
                />
              ))}
            </ContentRow>
            <ContentRow
              cols={3}
              gap={0}
              widthFull
              justifyContent="space-between"
              alignItems="center"
            >
              <ContentRow cols={1} gap={3} marginTop={3}>
                {inputDataTwo.map((el, index) => (
                  <Input
                    key={`${el.id * 39}adduser${index + index}`}
                    label={el.label}
                    name={el.name}
                    value={el.value}
                    type={el.type}
                    width={el.width}
                    onChange={el.onChange}
                    fieldErrors={fieldErrorsState}
                  />
                ))}
              </ContentRow>
              <UserImage
                localImageUploaded={localImageUploaded}
                name="userImage"
                onChange={handleImageUpload}
                fieldErrors={fieldErrorsState}
              />
              <Input
                label="Username"
                name="username"
                value={inputs.username}
                onChange={handleInputsChange}
                width={18.5}
                type="text"
                fieldErrors={fieldErrorsState}
              />
            </ContentRow>
          </BorderedContent>
          <ButtonContainer marginTop={4} widthFull justify="right">
            <Button
              backgroundColor="#00A78B"
              identity="save"
              textColor="#FFF"
              buttonText="Save"
              width={11.875}
              onClick={handleSubmitForm}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
