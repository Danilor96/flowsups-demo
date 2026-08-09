import { useEffect, useState } from 'react';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Input } from '&/inputs/Input';
import { Button } from '&/buttons/Button';
import { TagList } from '&/miscellaneous/tagList/TagList';
import { adminDashboardStore, messagesStore } from '@/store/adminDashboard';

export function CustomBeBackReasons() {
  // ----- global states -----

  const { setMessages } = messagesStore();

  const { /*customBeBackReasons, customNoSaleReasons,*/ customLostReasons } = adminDashboardStore();

  const { /*getCustomBeBackReasons, getCustomNoSaleReasons,*/ getCustomLostReasons } =
    adminDashboardStore();

  useEffect(() => {
    // getCustomBeBackReasons();
    // getCustomNoSaleReasons();
    getCustomLostReasons();
  }, [/*getCustomBeBackReasons, getCustomNoSaleReasons,*/ getCustomLostReasons]);

  // ----- local states -----

  const [inputs, setInputs] = useState<{
    // customBeBackReasons: string;
    // customNoSaleReasons: string;
    customLostReasons: string;
  }>({
    // customBeBackReasons: '',
    // customNoSaleReasons: '',
    customLostReasons: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{
    // customBeBackReasons: [string | undefined];
    // customNoSaleReasons: [string | undefined];
    customLostReasons: [string | undefined];
  }>({
    // customBeBackReasons: [''],
    // customNoSaleReasons: [''],
    customLostReasons: [''],
  });

  // const [items1, setItems1] = useState<{ id: number | undefined; name: string | undefined }[]>([]);

  // useEffect(() => {
  //   if (customBeBackReasons) {
  //     const newArray: { id: number | undefined; name: string | undefined }[] = [];

  //     customBeBackReasons.map((el) => newArray.push({ id: el.id, name: el.reason }));

  //     setItems1(newArray);
  //   }
  // }, [customBeBackReasons]);

  // const [items2, setItems2] = useState<{ id: number | undefined; name: string | undefined }[]>([]);

  // useEffect(() => {
  //   if (customNoSaleReasons) {
  //     const newArray: { id: number | undefined; name: string | undefined }[] = [];

  //     customNoSaleReasons.map((el) => newArray.push({ id: el.id, name: el.reason }));

  //     setItems2(newArray);
  //   }
  // }, [customNoSaleReasons]);

  const [items3, setItems3] = useState<{ id: number | undefined; name: string | undefined }[]>([]);

  useEffect(() => {
    if (customLostReasons) {
      const newArray: { id: number | undefined; name: string | undefined }[] = [];

      customLostReasons.map((el) => newArray.push({ id: el.id, name: el.reason }));

      setItems3(newArray);
    }
  }, [customLostReasons]);

  // handling change inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // handling buttons
  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity, id } = e.currentTarget.dataset;

    // if (identity === 'customBeBackReasons') {
    //   if (id) {
    //     try {
    //       const res = await (
    //         await fetch(`/api/settings/customBeBackReasons/${id}`, { method: 'DELETE' })
    //       ).json();

    //       if (res.successMessage) {
    //         getCustomBeBackReasons();
    //         setMessages((prevState) => ({
    //           ...prevState,
    //           successMessage: res.successMessage,
    //         }));
    //       }

    //       if (res.serverError) {
    //         setMessages((prevState) => ({
    //           ...prevState,
    //           serverError: res.serverError,
    //         }));
    //       }
    //     } catch (error) {
    //       setMessages((prevState) => ({
    //         ...prevState,
    //         serverError: 'An error occurred',
    //       }));
    //     }
    //   } else {
    //     try {
    //       const formData = new FormData();

    //       inputs.customBeBackReasons &&
    //         formData.append('customBeBackReasons', inputs.customBeBackReasons);

    //       const res = await (
    //         await fetch('/api/settings/customBeBackReasons', { method: 'POST', body: formData })
    //       ).json();

    //       if (res.successMessage) {
    //         getCustomBeBackReasons();
    //         setMessages((prevState) => ({
    //           ...prevState,
    //           successMessage: res.successMessage,
    //         }));
    //         setFieldErrors((prevState) => ({
    //           ...prevState,
    //           forwardIncoming: [''],
    //         }));
    //         setInputs((prevState) => ({
    //           ...prevState,
    //           customBeBackReasons: '',
    //         }));
    //       }

    //       if (res.serverError) {
    //         setMessages((prevState) => ({
    //           ...prevState,
    //           serverError: res.serverError,
    //         }));
    //       }

    //       if (res.fieldErrors) {
    //         setFieldErrors(res.fieldErrors);
    //       }
    //     } catch (error) {
    //       setMessages((prevState) => ({
    //         ...prevState,
    //         serverError: 'An error occurred',
    //       }));
    //     }
    //   }
    // }

    // if (identity === 'customNoSaleReasons') {
    //   if (id) {
    //     try {
    //       const res = await (
    //         await fetch(`/api/settings/customNoSaleReasons/${id}`, { method: 'DELETE' })
    //       ).json();

    //       if (res.successMessage) {
    //         getCustomNoSaleReasons();
    //         setMessages((prevState) => ({
    //           ...prevState,
    //           successMessage: res.successMessage,
    //         }));
    //       }

    //       if (res.serverError) {
    //         setMessages((prevState) => ({
    //           ...prevState,
    //           serverError: res.serverError,
    //         }));
    //       }
    //     } catch (error) {
    //       setMessages((prevState) => ({
    //         ...prevState,
    //         serverError: 'An error occurred',
    //       }));
    //     }
    //   } else {
    //     try {
    //       const formData = new FormData();

    //       inputs.customNoSaleReasons &&
    //         formData.append('customNoSaleReasons', inputs.customNoSaleReasons);

    //       const res = await (
    //         await fetch('/api/settings/customNoSaleReasons', { method: 'POST', body: formData })
    //       ).json();

    //       if (res.successMessage) {
    //         getCustomNoSaleReasons();
    //         setMessages((prevState) => ({
    //           ...prevState,
    //           successMessage: res.successMessage,
    //         }));
    //         setFieldErrors((prevState) => ({
    //           ...prevState,
    //           forwardIncoming: [''],
    //         }));
    //         setInputs((prevState) => ({
    //           ...prevState,
    //           customNoSaleReasons: '',
    //         }));
    //       }

    //       if (res.serverError) {
    //         setMessages((prevState) => ({
    //           ...prevState,
    //           serverError: res.serverError,
    //         }));
    //       }

    //       if (res.fieldErrors) {
    //         setFieldErrors(res.fieldErrors);
    //       }
    //     } catch (error) {
    //       setMessages((prevState) => ({
    //         ...prevState,
    //         serverError: 'An error occurred',
    //       }));
    //     }
    //   }
    // }

    if (identity === 'customLostReasons') {
      if (id) {
        try {
          const res = await (
            await fetch(`/api/settings/customLostReason/${id}`, { method: 'DELETE' })
          ).json();

          if (res.successMessage) {
            getCustomLostReasons();
            setMessages(undefined, res.successMessage);
          }

          if (res.serverError) {
            setMessages(res.serverError);
          }
        } catch (error) {
          setMessages('An error occurred');
        }
      } else {
        try {
          const formData = new FormData();

          inputs.customLostReasons &&
            formData.append('customLostReasons', inputs.customLostReasons);

          const res = await (
            await fetch('/api/settings/customLostReason', { method: 'POST', body: formData })
          ).json();

          if (res.successMessage) {
            getCustomLostReasons();
            setMessages(undefined, res.successMessage);
            setFieldErrors((prevState) => ({
              ...prevState,
              forwardIncoming: [''],
            }));
            setInputs((prevState) => ({
              ...prevState,
              customLostReasons: '',
            }));
          }

          if (res.serverError) {
            setMessages(res.serverError);
          }

          if (res.fieldErrors) {
            setFieldErrors(res.fieldErrors);
          }
        } catch (error) {
          setMessages('An error occurred');
        }
      }
    }
  };

  // 1) custom be-back reason ----------------------------------------------------------------------------------------------------------------------

  // <ModalContent widthFull flexbox flexRow gap={1.302083} height={48.796296}>
  // <BorderedContent title="Custom Be-Back Reasons">
  //         <ButtonContainer marginTop={0} alignContentEnd gap={1.3}>
  //           <Input
  //             label=""
  //             name="customBeBackReasons"
  //             type="text"
  //             value={inputs.customBeBackReasons}
  //             width={20.9375}
  //             onChange={handleChange}
  //             fieldErrors={fieldErrors}
  //           />
  //           <Button
  //             backgroundColor="#00A78B"
  //             height={5.277778}
  //             width={6.25}
  //             textColor="#FFF"
  //             identity="customBeBackReasons"
  //             buttonText="Add"
  //             onClick={handleButton}
  //           />
  //         </ButtonContainer>
  //         <TagList
  //           marginTop={2}
  //           height={23}
  //           onClick={handleButton}
  //           items={items1}
  //           identity="customBeBackReasons"
  //         />
  //       </BorderedContent>

  // ) custom no sale reason ----------------------------------------------------------------------------------------------------------------------

  // <BorderedContent title="Custom No Sale Reasons">
  //         <ButtonContainer marginTop={0} alignContentEnd gap={1.3}>
  //           <Input
  //             label=""
  //             name="customNoSaleReasons"
  //             type="text"
  //             value={inputs.customNoSaleReasons}
  //             width={20.9375}
  //             onChange={handleChange}
  //             fieldErrors={fieldErrors}
  //           />
  //           <Button
  //             backgroundColor="#00A78B"
  //             height={5.277778}
  //             width={6.25}
  //             textColor="#FFF"
  //             identity="customNoSaleReasons"
  //             buttonText="Add"
  //             onClick={handleButton}
  //           />
  //         </ButtonContainer>
  //         <TagList
  //           marginTop={2}
  //           height={23}
  //           onClick={handleButton}
  //           items={items2}
  //           identity="customNoSaleReasons"
  //         />
  //       </BorderedContent>
  // </ModalContent>

  return (
    <ModalContent flexbox flexCol>
      <BorderedContent width={75} centerComponent title="Custom Lost Reasons">
        <ButtonContainer marginTop={0} alignContentEnd gap={1.3}>
          <Input
            label=""
            name="customLostReasons"
            type="text"
            value={inputs.customLostReasons}
            width={32.03125}
            onChange={handleChange}
            fieldErrors={fieldErrors}
          />
          <Button
            backgroundColor="#00A78B"
            height={5.277778}
            width={6.25}
            textColor="#FFF"
            identity="customLostReasons"
            buttonText="Add"
            onClick={handleButton}
          />
        </ButtonContainer>
        <TagList
          marginTop={2}
          height={23}
          onClick={handleButton}
          items={items3}
          identity="customLostReasons"
        />
      </BorderedContent>
    </ModalContent>
  );
}
