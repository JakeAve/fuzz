import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { Factors, predicates as ps, scoreMatch, scoreMatches } from "./mod.ts";
import { findLongestStreak } from "./utils/findLongestStreak.ts";
import { getNumberOfSharedLetters } from "./utils/getNumberOfSharedLetters.ts";

Deno.test("hasExactMatchPredicate works", () => {
  const isFooInFood = ps[Factors.hasExactMatch]("foo", "food");
  assert(isFooInFood);
  const isDInFoo = ps[Factors.hasExactMatch]("d", "foo");
  assertEquals(isDInFoo, false);
});

Deno.test("hasLettersInOrder works", () => {
  const fooWithFood = ps[Factors.hasLettersInOrder]("foo", "food");
  assert(fooWithFood);
  const walkInWhamlkd = ps[Factors.hasLettersInOrder]("walk", "whamlkd");
  assert(walkInWhamlkd);
  const pkgJsonInPackageJson = ps[Factors.hasLettersInOrder](
    "pkgjson",
    "packagejson"
  );
  assert(pkgJsonInPackageJson);
  const effInEvanston = ps[Factors.hasLettersInOrder]("eff", "evanston");
  assertEquals(effInEvanston, false);
});

Deno.test("isSimilarWithoutConsecutives works", () => {
  const fooWithFood = ps[Factors.isSimilarWithoutConsecutives]("foo", "food");
  assert(fooWithFood);
  const lluuckWithLuck = ps[Factors.isSimilarWithoutConsecutives](
    "lluuck",
    "luckk"
  );
  assert(lluuckWithLuck);
  const ardvarkInElephant = ps[Factors.isSimilarWithoutConsecutives](
    "ardvark",
    "elephant"
  );
  assertEquals(ardvarkInElephant, false);
});

Deno.test("hasDiatrics works", () => {
  const test1 = ps[Factors.hasDiatrics]("ándrés", "andres");
  assert(test1);
  const test2 = ps[Factors.hasDiatrics]("cliché", "cliche");
  assert(test2);
  const test3 = ps[Factors.hasDiatrics]("naïve", "naive");
  assert(test3);
  const test4 = ps[Factors.hasDiatrics]("são paulo", "sao paulo");
  assert(test4);
  const test5 = ps[Factors.hasDiatrics]("piñón", "pinon");
  assert(test5);
  const test6 = ps[Factors.hasDiatrics]("cæsar", "caesar"); // not the best test
  assert(test6);
  const test7 = ps[Factors.hasDiatrics]("françois", "franswa");
  assertEquals(test7, false);
});

Deno.test("findLongestStreak works", () => {
  const l1 = findLongestStreak("ace", "race");
  assertEquals(l1, 3);
  const l2 = findLongestStreak("camera", "cam");
  assertEquals(l2, 3);
  const l3 = findLongestStreak(
    "somefragilistic",
    "supercalifragilisticexpialidocious"
  );
  assertEquals(11, l3);
});

Deno.test("getNumberOfSharedLetters works", () => {
  const five = getNumberOfSharedLetters("abcde", "a blue cow drank");
  assertEquals(five, 5);
  const two = getNumberOfSharedLetters("foo", "food");
  assertEquals(two, 2);
});

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

Deno.test("scoring and sorting works", () => {
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
  assert(scores);
});
