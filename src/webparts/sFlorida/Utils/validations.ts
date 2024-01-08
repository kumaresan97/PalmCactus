const getAlphabets = (value: string) => {
  let sanitizedValue = value.replace(/[^a-zA-Z ]/g, "");
  return sanitizedValue;
};

const getNumbersAndSPLChars = (value: string) => {
  let sanitizedValue = value.replace(/[^0-9+()-\s]/g, "");
  return sanitizedValue;
};

export { getAlphabets, getNumbersAndSPLChars };
