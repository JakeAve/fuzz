import { PredicateEnum, predicates } from "./predicates.ts";

type ScoringConfig = {
  [k in PredicateEnum]?: number;
};

const defaultScoringConfig: ScoringConfig = {
  [PredicateEnum.hasExactMatch]: 25,
  [PredicateEnum.hasExactMatchWithDiacritics]: 10,
  [PredicateEnum.hasLettersInOrder]: 10,
  [PredicateEnum.isSimilarWithoutConsecutives]: 10,
  [PredicateEnum.hasDiacriticsInOrder]: 10,
  [PredicateEnum.isLongestStreak3orMore]: 10,
  [PredicateEnum.isLongestStreak4orMore]: 5,
  [PredicateEnum.has3OrMoreSharedLetters]: 5,
  [PredicateEnum.isSameFirstLetter]: 5,
  [PredicateEnum.isSameFirst2Letters]: 5,
  [PredicateEnum.isSameFirst3Letters]: 5,
  [PredicateEnum.isSameFirst4Letters]: 5,
  [PredicateEnum.isSameLength]: 2,
  [PredicateEnum.areMoreThanHalfLettersShared]: 5,
  [PredicateEnum.hasExactMatchWithoutVowels]: 10,
  [PredicateEnum.isDistanceLessThan50Percent]: 5,
  [PredicateEnum.isDistanceLessThan20Percent]: 15,
  [PredicateEnum.isDistanceLessThan10Percent]: 10,
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
    const points = config[factor as PredicateEnum];
    const pred = predicates[factor as PredicateEnum];
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
    const points = config[factor as PredicateEnum];
    const pred = predicates[factor as PredicateEnum];
    if (pred(input, string)) {
      details.score += points as number;
      details[factor as PredicateEnum] = points;
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
  minPercentage?: number;
}

export const scoreMatches = (
  input: string,
  strings: string[],
  options: ScoreMatchesOptions = {},
  config?: ScoringConfig
) => {
  const scores: ScoresObject = {};
  strings.forEach((str) => (scores[str] = scoreMatch(input, str, config)));

  const {
    format = "object",
    min = 0,
    maxLength = strings.length,
    minPercentage = 0,
  } = options;

  const maxScore = Object.values(config || defaultScoringConfig).reduce(
    (prev, curr) => (prev += curr),
    0
  );
  const minScore = minPercentage * maxScore;

  const arr = Object.entries(scores)
    .filter(([, v1]) => v1 > min && v1 > minScore)
    .sort(([w1, v1], [w2, v2]) => {
      if (v2 === v1) return w1.localeCompare(w2);
      return v2 - v1;
    })
    .slice(0, maxLength);

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
