import { messagesStore } from '@/store/adminDashboard';
import { useState } from 'react';

type FieldErrors = { [key: string]: [string | undefined] };

interface AsyncFetchOptions {
  onSuccess?: (data?: any) => void;
  onError?: (json?: any) => void;
  onFieldErrors?: (errors: FieldErrors) => void;
  onLocalError?: (error?: unknown) => void;
}

export function useAsyncFetching() {
  // ----- global states -----

  const { setMessages } = messagesStore();

  // ----- local states -----

  const [loadingFetch, setLoadingFetch] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    | {
        [key: string]: [string | undefined];
      }
    | undefined
  >(undefined);

  const makeAsyncFetch = async ({
    apiUrl,
    formData,
    body,
    method,
    noLoadingWhileFetch,
    noShowMessage,
    options,
    permissionForFetch,
  }: {
    formData?: FormData;
    body?: any;
    apiUrl: string;
    method: string;
    permissionForFetch?: number;
    options?: AsyncFetchOptions;
    noShowMessage?: boolean;
    noLoadingWhileFetch?: boolean;
  }) => {
    if (!noLoadingWhileFetch) setLoadingFetch(true);
    setFieldErrors(undefined);
    setMessages(undefined);

    try {
      const fetchOptions: RequestInit = {
        method,
      };

      if (body) {
        let bodyToSend = body;

        if (permissionForFetch && typeof body === 'object' && body !== null) {
          bodyToSend = { ...body, _PERMISSION_: permissionForFetch };
        }

        fetchOptions.body = JSON.stringify(bodyToSend);
        fetchOptions.headers = {
          'Content-Type': 'application/json',
        };
      } else {
        const formDataBody = formData || new FormData();

        if (permissionForFetch) {
          formDataBody.append('_PERMISSION_', `${permissionForFetch}`);
        }

        fetchOptions.body = formDataBody;
      }

      const res = await fetch(apiUrl, fetchOptions);
      if (res.status === 401) {
        window.location.href = '/';
        return;
      }

      // const contentType = res.headers.get('content-type');

      const json = await res.json();

      if (json.successMessage) {
        if (!noShowMessage) setMessages(undefined, json.successMessage);

        setFieldErrors(undefined);

        options?.onSuccess?.(json.data);
      }

      if (json.serverError) {
        setMessages(json.serverError);

        options?.onError?.(json);
      }

      if (json.fieldErrors) {
        setFieldErrors(json.fieldErrors);

        options?.onFieldErrors?.(json.fieldErrors);
      }
    } catch (error) {
      options?.onLocalError?.(error);

      setMessages('An error occurred');
    } finally {
      setLoadingFetch(false);
    }
  };

  const setManualFieldErrors = (errors: typeof fieldErrors) => {
    setFieldErrors(errors);
  };

  return { loadingFetch, fieldErrors, makeAsyncFetch, setManualFieldErrors, setMessages };
}
