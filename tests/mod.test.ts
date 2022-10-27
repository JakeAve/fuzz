import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { scoreMatch, scoreMatches, ScoresArray, ScoresObject } from "../mod.ts";

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
