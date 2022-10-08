import { replaceDiacritics } from "./utils/replaceDiacritics.ts";

export enum Factors {
  hasExactMatch = "hasExactMatch",
  hasLettersInOrder = "hasLettersInOrder",
  isSimilarWithoutConsecutives = "isSimilarWithoutConsecutives",
  hasDiatrics = "hasDiatrics",
}

type Predicate = (input: string, string: string) => boolean;

interface FactorList {
  [key: string]: [Predicate, number];
}

const removeConsecutiveDuplicates = (s: string) => {
  const n = s.length;
  let str = "";
  if (n == 0) return str;

  for (let i = 0; i < n - 1; i++) {
    if (s[i] != s[i + 1]) {
      str += s[i];
    }
  }

  str += s[n - 1];
  return str;
};

export const predicates = {
  [Factors.hasExactMatch]: (input: string, string: string) =>
    string.includes(input),
  [Factors.hasLettersInOrder]: (input: string, string: string) => {
    let result = true;

    let str = string;
    for (const char of input) {
      const indexOf = str.indexOf(char);
      if (indexOf >= 0) str = str.slice(indexOf);
      else result = false;
    }

    return result;
  },
  [Factors.isSimilarWithoutConsecutives]: (input: string, string: string) => {
    const inputWithoutCons = removeConsecutiveDuplicates(input);
    const stringWithoutCons = removeConsecutiveDuplicates(string);
    return predicates[Factors.hasLettersInOrder](
      inputWithoutCons,
      stringWithoutCons
    );
  },
  [Factors.hasDiatrics]: (input: string, string: string) => {
    const inputWithoutDiatrics = replaceDiacritics(input);
    const stringWithoutDiatrics = replaceDiacritics(string);
    return predicates[Factors.hasLettersInOrder](
      inputWithoutDiatrics,
      stringWithoutDiatrics
    );
  },
};

const factors: FactorList = {
  [Factors.hasExactMatch]: [predicates[Factors.hasExactMatch], 50],
  [Factors.hasLettersInOrder]: [predicates[Factors.hasLettersInOrder], 20],
  [Factors.isSimilarWithoutConsecutives]: [
    predicates[Factors.isSimilarWithoutConsecutives],
    10,
  ],
};

export const scoreMatch = (input: string, string: string) => {
  input = input.toLowerCase();
  string = string.toLowerCase();
  let score = 0;

  for (const f in factors) {
    const [pred, points] = factors[f];
    if (pred(input, string)) score += points;
  }

  return score;
};
