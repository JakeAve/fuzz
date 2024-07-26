import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.159.0/testing/asserts.ts";
import {
  scoreMatch,
  scoreMatches,
  ScoresArray,
  ScoresObject,
  scoreObjects,
  ScoresTuple,
} from "../mod.ts";

Deno.test("scoreMatch returns number", () => {
  const s1 = scoreMatch("foo", "food");
  const s2 = scoreMatch("walk", "whamlkd");
  const s3 = scoreMatch("cæsar", "caesar");
  const s4 = scoreMatch("lluuck", "luckk");
  const s5 = scoreMatch("pkgjson", "packagejson");
  const results = [s1, s2, s3, s4, s5];
  results.forEach((score) => assertEquals(typeof score, "number"));
});

Deno.test("scoreMatch returns 0 on empty string", () => {
  assertEquals(scoreMatch("", "anything"), 0);
});

Deno.test("scoreMatches sorts appropriately", () => {
  const scores = scoreMatches("trick", [
    "train",
    "true",
    "tamberine",
    "tacid",
    "rock",
    "expert",
    "food",
    "brick",
    "tricky",
    "trim",
  ]);
  let didIncrease = false;
  let highScore = 999;
  for (const score of Object.values(scores as ScoresObject)) {
    if (score > highScore) {
      didIncrease = true;
      break;
    }
    highScore = score;
  }
  assertEquals(didIncrease, false);
});

Deno.test("scoreMatches does an object", () => {
  const scores = scoreMatches("trick", [
    "train",
    "true",
    "tamberine",
    "tacid",
    "rock",
    "expert",
    "food",
    "brick",
    "tricky",
    "trim",
  ]) as ScoresObject;
  assert(typeof scores === "object");
  assert(scores["train"]);
});

Deno.test("scoreMatches does an array", () => {
  const scores = scoreMatches(
    "trick",
    [
      "train",
      "true",
      "tamberine",
      "tacid",
      "rock",
      "expert",
      "food",
      "brick",
      "tricky",
      "trim",
    ],
    { format: "array" }
  ) as ScoresArray;
  assert(Array.isArray(scores));
});

Deno.test("scoreMatches does a tuple", () => {
  const scores = scoreMatches(
    "trick",
    [
      "train",
      "true",
      "tamberine",
      "tacid",
      "rock",
      "expert",
      "food",
      "brick",
      "tricky",
      "trim",
    ],
    { format: "tuple" }
  ) as ScoresArray;
  assert(Array.isArray(scores));
  assert(Array.isArray(scores[0]));
});

Deno.test("scoreMatches maxLength", () => {
  const scores = scoreMatches(
    "trick",
    [
      "train",
      "true",
      "tamberine",
      "tacid",
      "rock",
      "expert",
      "food",
      "brick",
      "tricky",
      "trim",
    ],
    { format: "array", maxLength: 2 }
  ) as ScoresArray;
  assertEquals(scores.length, 2);
});

Deno.test("scoreMatched custom predicates", () => {
  const scores = scoreMatches(
    "42",
    ["what", "is", "the", "meaning", "42"],
    {
      format: "tuple",
    },
    { isTheAnswerToLife: [(_input: string, string) => string === "42", 1000] }
  ) as ScoresTuple;

  assertEquals(scores.length, 1);
  assertEquals(scores[0], ['42', 1000]);
});

Deno.test("scoreObjects", () => {
  const scores = scoreObjects(
    "trick",
    [
      {
        title: "Northanger Abbey",
        author: "Austen, Jane",
        year_written: 1814,
        edition: "Penguin",
        price: 18.2,
      },
      {
        title: "War and Peace",
        author: "Tolstoy, Leo",
        year_written: 1865,
        edition: "Penguin",
        price: 12.7,
      },
      {
        title: "Anna Karenina",
        author: "Tolstoy, Leo",
        year_written: 1875,
        edition: "Penguin",
        price: 13.5,
      },
      {
        title: "Mrs. Dalloway",
        author: "Woolf, Virginia",
        year_written: 1925,
        edition: "Harcourt Brace",
        price: 25,
      },
      {
        title: "The Hours",
        author: "Cunnningham, Michael",
        year_written: 1999,
        edition: "Harcourt Brace",
        price: 12.35,
      },
      {
        title: "Huckleberry Finn",
        author: "Twain, Mark",
        year_written: 1865,
        edition: "Penguin",
        price: 5.76,
      },
      {
        title: "Bleak House",
        author: "Dickens, Charles",
        year_written: 1870,
        edition: "Random House",
        price: 5.75,
      },
      {
        title: "Tom Sawyer",
        author: "Twain, Mark",
        year_written: 1862,
        edition: "Random House",
        price: 7.75,
      },
      {
        title: "A Room of One's Own",
        author: "Woolf, Virginia",
        year_written: 1922,
        edition: "Penguin",
        price: 29,
      },
      {
        title: "Harry Potter",
        author: "Rowling, J.K.",
        year_written: 2000,
        edition: "Harcourt Brace",
        price: 19.95,
      },
      {
        title: "One Hundred Years of Solitude",
        author: "Marquez",
        year_written: 1967,
        edition: "Harper  Perennial",
        price: 14.0,
      },
      {
        title: "Hamlet, Prince of Denmark",
        author: "Shakespeare",
        year_written: 1603,
        edition: "Signet  Classics",
        price: 7.95,
      },
      {
        title: "Lord of the Rings",
        author: "Tolkien, J.R.",
        year_written: 1937,
        edition: "Penguin",
        price: 27.45,
      },
    ],
    { format: "array", maxLength: 2 }
  ) as unknown as ScoresArray;
  assertEquals(scores.length, 2);
});
