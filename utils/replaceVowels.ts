import { replaceDiacritics } from "./replaceDiacritics.ts";

export const replaceVowels = (input: string) => {
  const withoutDiacritics = replaceDiacritics(input);
  return withoutDiacritics.replace(/a|e|i|o|u/g, " ");
};
