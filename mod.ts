import { findLongestStreak } from "./utils/findLongestStreak.ts";
import { getNumberOfSharedLetters } from "./utils/getNumberOfSharedLetters.ts";
import { removeConsecutiveDuplicates } from "./utils/removeConsecutiveDuplicates.ts";
import { replaceDiacritics } from "./utils/replaceDiacritics.ts";

export enum Factors {
  hasExactMatch = "hasExactMatch",
  hasLettersInOrder = "hasLettersInOrder",
  isSimilarWithoutConsecutives = "isSimilarWithoutConsecutives",
  hasDiatrics = "hasDiatrics",
  isLongestStreak3orMore = "isLongestStreak3orMore",
  has3OrMoreSharedLetters = "has3OrMoreSharedLetters",
  isSameFirstLetter = "isSameFirstLetter",
  isSameFirst2Letters = "isSameFirst2Letters",
  isSameFirst3Letters = "isSameFirst3Letters",
  isSameLength = "isSameLength",
}

type Predicate = (input: string, string: string) => boolean;

type Predicates = {
  [k in Factors]: Predicate;
};

export const predicates: Predicates = {
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
  [Factors.isLongestStreak3orMore]: (input: string, string: string) =>
    findLongestStreak(input, string) >= 3,
  [Factors.has3OrMoreSharedLetters]: (input: string, string: string) =>
    getNumberOfSharedLetters(input, string) >= 3,
  [Factors.isSameFirstLetter]: (input: string, string: string) => {
    const l1 = replaceDiacritics(input.charAt(0));
    const l2 = replaceDiacritics(string.charAt(0));
    return l1 === l2;
  },
  [Factors.isSameFirst2Letters]: (input: string, string: string) => {
    const l1 = replaceDiacritics(input.slice(0, 2));
    const l2 = replaceDiacritics(string.slice(0, 2));
    return l1 === l2;
  },
  [Factors.isSameFirst3Letters]: (input: string, string: string) => {
    const l1 = replaceDiacritics(input.slice(0, 3));
    const l2 = replaceDiacritics(string.slice(0, 3));
    return l1 === l2;
  },
  [Factors.isSameLength]: (input: string, string: string) =>
    input.length === string.length,
};

type ScoringConfig = {
  [k in Factors]?: number;
};

const defaultScoringConfig: ScoringConfig = {
  [Factors.hasExactMatch]: 50,
  [Factors.hasLettersInOrder]: 20,
  [Factors.isSimilarWithoutConsecutives]: 15,
  [Factors.hasDiatrics]: 10,
  [Factors.isLongestStreak3orMore]: 10,
  [Factors.has3OrMoreSharedLetters]: 5,
  [Factors.isSameFirstLetter]: 5,
  [Factors.isSameFirst2Letters]: 5,
  [Factors.isSameFirst3Letters]: 5,
  [Factors.isSameLength]: 2,
};

export const scoreMatch = (
  input: string,
  string: string,
  config: ScoringConfig = defaultScoringConfig
) => {
  let score = 0;
  if (input === "") return score;
  input = input.toLowerCase();
  string = string.toLowerCase();

  for (const factor in config) {
    const points = config[factor as Factors];
    const pred = predicates[factor as Factors];
    if (pred(input, string)) score += points as number;
  }

  return score;
};

interface Scores {
  [key: string]: number;
}

export const scoreMatches = (
  input: string,
  strings: string[],
  config?: ScoringConfig
) => {
  const scores: Scores = {};
  strings.forEach((str) => (scores[str] = scoreMatch(input, str, config)));

  const scores2: Scores = {};
  Object.entries(scores)
    .sort(([w1, v1], [w2, v2]) => {
      if (v2 === v1) return w1.localeCompare(w2);
      return v2 - v1;
    })
    .forEach(([k, v]) => (scores2[k] = v));

  return scores2;
};
