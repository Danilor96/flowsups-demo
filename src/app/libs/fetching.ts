export const doFetch = async (
  url: string,
  method?: string,
  formData?: FormData,
  object?: Object,
) => {
  try {
    let res;

    if (!formData && !object) {
      res = await (await fetch(url, { method: method ? method : 'GET' })).json();
    }

    if (formData) {
      res = await (await fetch(url, { method: method ? method : 'GET', body: formData })).json();
    }

    if (object) {
      res = await (
        await fetch(url, { method: method ? method : 'GET', body: JSON.stringify(object) })
      ).json();
    }

    return res;
  } catch (error) {
    return error;
  }
};
