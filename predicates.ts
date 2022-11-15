import { findLongestStreak } from "./utils/findLongestStreak.ts";
import { getNumberOfSharedLetters } from "./utils/getNumberOfSharedLetters.ts";
import { removeConsecutiveDuplicates } from "./utils/removeConsecutiveDuplicates.ts";
import { replaceDiacritics } from "./utils/replaceDiacritics.ts";
import { replaceVowels } from "./utils/replaceVowels.ts";
import { levenshteinDistance } from "./utils/levenshteinDistance.ts";

export enum PredicateEnum {
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
  isDistanceLessThan50Percent = "isDistanceLessThan50Percent",
  isDistanceLessThan20Percent = "isDistanceLessThan20Percent",
  isDistanceLessThan10Percent = "isDistanceLessThan10Percent",
}

type Predicate = (input: string, string: string) => boolean;

type Predicates = {
  [k in PredicateEnum]: Predicate;
};

export const predicates: Predicates = {
  [PredicateEnum.hasExactMatch]: (input: string, string: string) =>
    string.includes(input),
  [PredicateEnum.hasExactMatchWithDiacritics]: (
    input: string,
    string: string
  ) => replaceDiacritics(string).includes(replaceDiacritics(input)),
  [PredicateEnum.hasLettersInOrder]: (input: string, string: string) => {
    let result = true;

    let str = string;
    for (const char of input) {
      const indexOf = str.indexOf(char);
      if (indexOf >= 0) str = str.slice(indexOf);
      else result = false;
    }

    return result;
  },
  [PredicateEnum.isSimilarWithoutConsecutives]: (
    input: string,
    string: string
  ) => {
    const inputWithoutCons = removeConsecutiveDuplicates(input);
    const stringWithoutCons = removeConsecutiveDuplicates(string);
    return predicates[PredicateEnum.hasLettersInOrder](
      inputWithoutCons,
      stringWithoutCons
    );
  },
  [PredicateEnum.hasDiacriticsInOrder]: (input: string, string: string) => {
    const inputWithoutDiatrics = replaceDiacritics(input);
    const stringWithoutDiatrics = replaceDiacritics(string);
    return predicates[PredicateEnum.hasLettersInOrder](
      inputWithoutDiatrics,
      stringWithoutDiatrics
    );
  },
  [PredicateEnum.isLongestStreak3orMore]: (input: string, string: string) =>
    findLongestStreak(input, string) >= 3,
  [PredicateEnum.isLongestStreak4orMore]: (input: string, string: string) =>
    findLongestStreak(input, string) >= 4,
  [PredicateEnum.has3OrMoreSharedLetters]: (input: string, string: string) =>
    getNumberOfSharedLetters(input, string) >= 3,
  [PredicateEnum.isSameFirstLetter]: (input: string, string: string) => {
    const l1 = replaceDiacritics(input.charAt(0));
    const l2 = replaceDiacritics(string.charAt(0));
    return l1 === l2;
  },
  [PredicateEnum.isSameFirst2Letters]: (input: string, string: string) => {
    const l1 = replaceDiacritics(input.slice(0, 2));
    const l2 = replaceDiacritics(string.slice(0, 2));
    return l1 === l2;
  },
  [PredicateEnum.isSameFirst3Letters]: (input: string, string: string) => {
    const l1 = replaceDiacritics(input.slice(0, 3));
    const l2 = replaceDiacritics(string.slice(0, 3));
    return l1 === l2;
  },
  [PredicateEnum.isSameFirst4Letters]: (input: string, string: string) => {
    const l1 = replaceDiacritics(input.slice(0, 4));
    const l2 = replaceDiacritics(string.slice(0, 4));
    return l1 === l2;
  },
  [PredicateEnum.isSameLength]: (input: string, string: string) =>
    input.length === string.length,
  [PredicateEnum.areMoreThanHalfLettersShared]: (
    input: string,
    string: string
  ) => {
    const sharedLetters = getNumberOfSharedLetters(
      replaceDiacritics(input),
      replaceDiacritics(string)
    );
    return sharedLetters / input.length > 0.5;
  },
  [PredicateEnum.hasExactMatchWithoutVowels]: (input: string, string: string) =>
    replaceVowels(string).includes(replaceVowels(input)),
  [PredicateEnum.isDistanceLessThan50Percent]: (
    input: string,
    string: string
  ) => {
    const d = levenshteinDistance(input, string);
    return d / input.length <= 0.5;
  },
  [PredicateEnum.isDistanceLessThan20Percent]: (
    input: string,
    string: string
  ) => {
    const d = levenshteinDistance(input, string);
    return d / input.length <= 0.2;
  },
  [PredicateEnum.isDistanceLessThan10Percent]: (
    input: string,
    string: string
  ) => {
    const d = levenshteinDistance(input, string);
    return d / input.length <= 0.1;
  },
};
