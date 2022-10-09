export const getNumberOfSharedLetters = (input: string, string: string) => {
  const i = new Set(input);
  const s = new Set(string);
  let num = 0;
  for (const c of i) if (s.has(c)) num++;
  return num;
};
