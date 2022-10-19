import { findLongestStreak } from "./utils/findLongestStreak.ts";
import { getNumberOfSharedLetters } from "./utils/getNumberOfSharedLetters.ts";
import { removeConsecutiveDuplicates } from "./utils/removeConsecutiveDuplicates.ts";
import { replaceDiacritics } from "./utils/replaceDiacritics.ts";
import { replaceVowels } from "./utils/replaceVowels.ts";

export enum Factors {
  hasExactMatch = "hasExactMatch",
  hasExactMatchWithDiacritics = "hasExactMatchWithDiacritics",
  hasLettersInOrder = "hasLettersInOrder",
  isSimilarWithoutConsecutives = "isSimilarWithoutConsecutives",
  hasDiacriticsInOrder = "hasDiacriticsInOrder",
  isLongestStreak3orMore = "isLongestStreak3orMore",
  isLongestStreak4orMore = "isLongestStreak4orMore",
  has3OrMoreSharedLetters = "has3OrMoreSharedLetters",
  isSameFirstLetter = "isSameFirstLetter",
  isSameFirst2Letters = "isSameFirst2Letters",
  isSameFirst3Letters = "isSameFirst3Letters",
  isSameFirst4Letters = "isSameFirst4Letters",
  isSameLength = "isSameLength",
  areMoreThanHalfLettersShared = "areMoreThanHalfLettersShared",
  hasExactMatchWithoutVowels = "hasExactMatchWithoutVowels",
}

type Predicate = (input: string, string: string) => boolean;

type Predicates = {
  [k in Factors]: Predicate;
};

export const predicates: Predicates = {
  [Factors.hasExactMatch]: (input: string, string: string) =>
    string.includes(input),
  [Factors.hasExactMatchWithDiacritics]: (input: string, string: string) =>
    replaceDiacritics(string).includes(replaceDiacritics(input)),
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
  [Factors.hasDiacriticsInOrder]: (input: string, string: string) => {
    const inputWithoutDiatrics = replaceDiacritics(input);
    const stringWithoutDiatrics = replaceDiacritics(string);
    return predicates[Factors.hasLettersInOrder](
      inputWithoutDiatrics,
      stringWithoutDiatrics
    );
  },
  [Factors.isLongestStreak3orMore]: (input: string, string: string) =>
    findLongestStreak(input, string) >= 3,
  [Factors.isLongestStreak4orMore]: (input: string, string: string) =>
    findLongestStreak(input, string) >= 4,
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
  [Factors.isSameFirst4Letters]: (input: string, string: string) => {
    const l1 = replaceDiacritics(input.slice(0, 4));
    const l2 = replaceDiacritics(string.slice(0, 4));
    return l1 === l2;
  },
  [Factors.isSameLength]: (input: string, string: string) =>
    input.length === string.length,
  [Factors.areMoreThanHalfLettersShared]: (input: string, string: string) => {
    const sharedLetters = getNumberOfSharedLetters(
      replaceDiacritics(input),
      replaceDiacritics(string)
    );
    return sharedLetters / input.length > 0.5;
  },
  [Factors.hasExactMatchWithoutVowels]: (input: string, string: string) =>
    replaceVowels(string).includes(replaceVowels(input)),
};

type ScoringConfig = {
  [k in Factors]?: number;
};

const defaultScoringConfig: ScoringConfig = {
  [Factors.hasExactMatch]: 25,
  [Factors.hasExactMatchWithDiacritics]: 10,
  [Factors.hasLettersInOrder]: 10,
  [Factors.isSimilarWithoutConsecutives]: 10,
  [Factors.hasDiacriticsInOrder]: 10,
  [Factors.isLongestStreak3orMore]: 10,
  [Factors.isLongestStreak4orMore]: 5,
  [Factors.has3OrMoreSharedLetters]: 5,
  [Factors.isSameFirstLetter]: 5,
  [Factors.isSameFirst2Letters]: 5,
  [Factors.isSameFirst3Letters]: 5,
  [Factors.isSameFirst4Letters]: 5,
  [Factors.isSameLength]: 2,
  [Factors.areMoreThanHalfLettersShared]: 5,
  [Factors.hasExactMatchWithoutVowels]: 10,
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

interface MatchScoreDetails extends ScoringConfig {
  score: number;
}

export const scoreMatchDetails = (
  input: string,
  string: string,
  config: ScoringConfig = defaultScoringConfig
) => {
  const details: MatchScoreDetails = { score: 0 };
  if (input === "") return details;
  input = input.toLowerCase();
  string = string.toLowerCase();

  for (const factor in config) {
    const points = config[factor as Factors];
    const pred = predicates[factor as Factors];
    if (pred(input, string)) {
      details.score += points as number;
      details[factor as Factors] = points;
    }
  }

  return details;
};

export interface ScoresObject {
  [key: string]: number;
}

export type ScoresArray = string[];

export type ScoresTuple = [string, number][];

interface ScoreMatchesOptions {
  format?: "array" | "tuple" | "object";
  min?: number;
  maxLength?: number;
}

export const scoreMatches = (
  input: string,
  strings: string[],
  options: ScoreMatchesOptions = {},
  config?: ScoringConfig
) => {
  const scores: ScoresObject = {};
  strings.forEach((str) => (scores[str] = scoreMatch(input, str, config)));

  const { format = "object", min = 0, maxLength = strings.length } = options;

  const arr = Object.entries(scores)
    .filter(([, v1], index) => v1 > min && index < maxLength)
    .sort(([w1, v1], [w2, v2]) => {
      if (v2 === v1) return w1.localeCompare(w2);
      return v2 - v1;
    });

  if (format === "array") return arr.map(([k]) => k) as ScoresArray;
  else if (format === "tuple") return arr as ScoresTuple;
  else {
    const scores2: ScoresObject = {};
    arr.forEach(([k, v]) => (scores2[k] = v));
    return scores2;
  }
};

interface ScoreMatchesDetails {
  [key: string]: MatchScoreDetails;
}

export const scoreMatchesDetails = (
  input: string,
  strings: string[],
  config?: ScoringConfig
) => {
  const scoreDetails: ScoreMatchesDetails = {};
  strings.forEach(
    (str) => (scoreDetails[str] = scoreMatchDetails(input, str, config))
  );

  const scores2: ScoreMatchesDetails = {};
  Object.entries(scoreDetails)
    .sort(([w1, { score: v1 }], [w2, { score: v2 }]) => {
      if (v2 === v1) return w1.localeCompare(w2);
      return v2 - v1;
    })
    .forEach(([k, v]) => (scores2[k] = v));

  return scores2;
};
