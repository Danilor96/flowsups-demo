export interface Banks {
  id: number;
  bank: string;
}

export const getData = async () => {
  const res = await fetch(`/api/banks`);

  const json: Banks[] = await res.json();

  return json;
};
