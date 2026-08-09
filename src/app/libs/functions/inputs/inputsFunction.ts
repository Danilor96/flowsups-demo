export const handlingCapitalWords = (value?: string | null) => {
  if (!value) return '';

  const wordsArray = value.split(' ');

  const resultString = wordsArray.reduce((acc, val) => {
    const capitalWord = val ? val.replace(val[0], val[0].toUpperCase()) : '';

    acc = `${acc ? `${acc} ` : ''}${capitalWord}`;

    return acc;
  }, '' as string);

  return resultString;
};
