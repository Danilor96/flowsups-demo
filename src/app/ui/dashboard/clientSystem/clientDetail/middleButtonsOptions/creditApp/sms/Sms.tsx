import { Loader } from '&/miscellaneous/loader/Loader';
import { Button } from '@/app/ui/buttons/Button';
import { ButtonContainer } from '@/app/ui/buttons/ButtonContainer';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { consentMessageStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function Sms({
  sms,
  onChange,
}: {
  sms: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  // ----- global states -----

  const { setSendCreditAppMessage } = consentMessageStore();

  const { singleCLientData } = singleCLientDataStore();

  useEffect(() => {
    if (singleCLientData && singleCLientData.id) {
      const customerName = `${singleCLientData.first_name || ''} ${
        singleCLientData.last_name || ''
      }`;

      setSendCreditAppMessage(customerName, singleCLientData.id).finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleCLientData]);

  // ----- local states -----

  const [loading, setLoading] = useState(true);

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData();

    formData.append('mssg', sms);

    const apiUrl = `/api/creditAppCode/send/${singleCLientData?.id}`;

    await makeAsyncFetch({ formData, apiUrl, method: 'POST' });
  };

  return (
    <article className="relative mt-[1.5vh]">
      <textarea
        name="message"
        id=""
        value={sms}
        onChange={onChange}
        className="w-full h-[50vh] resize-none text-[1.9vh] font-normal text-gray-950 px-[0.7vw] py-[0.8vh] border border-secondaryColor rounded-md outline-primaryColor"
      ></textarea>
      <ButtonContainer widthFull justify="right" marginTop={3}>
        <Button
          backgroundColor="#00A78B"
          buttonText="Send"
          height={5}
          width={7}
          textColor="#FFF"
          identity="sendCreditApp"
          onClick={handleButton}
        />
      </ButtonContainer>
      {(loading || loadingFetch) && <Loader />}
    </article>
  );
}
