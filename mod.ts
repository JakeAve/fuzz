import { PredicateEnum, predicates } from "./predicates.ts";

type Predicate = (input: string, string: string) => boolean;

type CustomPredicate = [Predicate, number];

type ScoringConfig = {
  [k in PredicateEnum]?: number;
} & {
  [key: string]: number | CustomPredicate;
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
  [PredicateEnum.isDistanceLessThan10Percent]: 15,
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
    let points = 0;
    let pred: undefined | Predicate;
    if ((config[factor] as CustomPredicate).length) {
      pred = (config[factor] as CustomPredicate)[0];
      points = (config[factor] as CustomPredicate)[1];
    } else {
      points = config[factor as PredicateEnum] as number;
      pred = predicates[factor as PredicateEnum];
    }
    if (pred(input, string)) score += points as number;
  }

  return score;
};

// interface MatchScoreDetails extends ScoringConfig {
//   score: number;
// }

interface MatchScoreDetails {
  score: number;
  details: Record<string, number>;
}

export const scoreMatchDetails = (
  input: string,
  string: string,
  config: ScoringConfig = defaultScoringConfig
) => {
  const matchScoreDetails: MatchScoreDetails = { score: 0, details: {} };
  if (input === "") return matchScoreDetails;
  input = input.toLowerCase();
  string = string.toLowerCase();

  for (const factor in config) {
    let points = 0;
    let pred: Predicate | undefined;
    if ((config[factor] as CustomPredicate).length) {
      pred = (config[factor] as CustomPredicate)[0];
      points = (config[factor] as CustomPredicate)[1];
    } else {
      points = config[factor as PredicateEnum] as number;
      pred = predicates[factor as PredicateEnum];
    }
    if (pred(input, string)) {
      matchScoreDetails.score += points;
      matchScoreDetails.details[factor] = points;
    }
  }

  return matchScoreDetails;
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
    (prev, curr) => {
      let prevSum = prev as number;
      if ((curr as CustomPredicate).length) {
        prevSum += (curr as CustomPredicate)[1];
      } else {
        prevSum += curr as number;
      }
      return prevSum;
    },
    0
  );
  const minScore = minPercentage * (maxScore as number);

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

export const scoreObjects = (
  input: string,
  objects: object[],
  options: ScoreMatchesOptions = {},
  config?: ScoringConfig
) => {
  const map = new Map();
  for (const o of objects) {
    const stringed = Object.values(o).join("\n");
    map.set(stringed, o);
  }
  const strings = [];
  for (const s of map.keys()) strings.push(s);
  const matches = scoreMatches(input, strings, options, config);
  const mapped = (matches as ScoresArray).map((m) => {
    const foo = map.get(m);
    return foo;
  });
  return mapped;
};
