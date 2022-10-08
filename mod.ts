import { removeConsecutiveDuplicates } from "./utils/removeConsecutiveDuplicates.ts";
import { replaceDiacritics } from "./utils/replaceDiacritics.ts";

export enum Factors {
  hasExactMatch = "hasExactMatch",
  hasLettersInOrder = "hasLettersInOrder",
  isSimilarWithoutConsecutives = "isSimilarWithoutConsecutives",
  hasDiatrics = "hasDiatrics",
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
};

type ScoringConfig = {
  [k in Factors]?: number;
};

const defaultScoringConfig: ScoringConfig = {
  [Factors.hasExactMatch]: 50,
  [Factors.hasLettersInOrder]: 20,
  [Factors.isSimilarWithoutConsecutives]: 20,
  [Factors.hasDiatrics]: 10,
};

export const scoreMatch = (
  input: string,
  string: string,
  config: ScoringConfig = defaultScoringConfig
) => {
  input = input.toLowerCase();
  string = string.toLowerCase();
  let score = 0;

  for (const factor in config) {
    const points = config[factor as Factors];
    const pred = predicates[factor as Factors];
    if (pred(input, string)) score += points as number;
  }

  return score;
};
