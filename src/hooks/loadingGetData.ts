import { messagesStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';

export function useLoadingGetData(getPromises: () => Promise<any>[], deps: any[] = []) {
  // ----- global states -----

  const { setMessages } = messagesStore();

  // ----- local states -----

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const promises = getPromises();

        if (promises.length === 0) return;

        setLoading(true);
        setError(null);
        await Promise.all(promises);
      } catch (err: any) {
        setError(err as Error);

        setMessages('An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPromises, ...deps]);

  return { loading, error, setLoading };
}
