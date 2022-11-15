import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { predicates as ps, PredicateEnum } from "../predicates.ts";

Deno.test("hasExactMatch works", () => {
  const isFooInFood = ps[PredicateEnum.hasExactMatch]("foo", "food");
  assert(isFooInFood);
  const isDInFoo = ps[PredicateEnum.hasExactMatch]("d", "foo");
  assertEquals(isDInFoo, false);
});

Deno.test("hasExactMatchWithDiacritics works", () => {
  const mamaInmamá = ps[PredicateEnum.hasExactMatchWithDiacritics](
    "mama",
    "mamá"
  );
  assert(mamaInmamá);
  const isDInFoo = ps[PredicateEnum.hasExactMatchWithDiacritics]("d", "fóo");
  assertEquals(isDInFoo, false);
});

Deno.test("hasLettersInOrder works", () => {
  const fooWithFood = ps[PredicateEnum.hasLettersInOrder]("foo", "food");
  assert(fooWithFood);
  const walkInWhamlkd = ps[PredicateEnum.hasLettersInOrder]("walk", "whamlkd");
  assert(walkInWhamlkd);
  const pkgJsonInPackageJson = ps[PredicateEnum.hasLettersInOrder](
    "pkgjson",
    "packagejson"
  );
  assert(pkgJsonInPackageJson);
  const effInEvanston = ps[PredicateEnum.hasLettersInOrder]("eff", "evanston");
  assertEquals(effInEvanston, false);
  const stateIsState = ps[PredicateEnum.hasLettersInOrder]("state", "states");
  assert(stateIsState);
});

Deno.test("isSimilarWithoutConsecutives works", () => {
  const fooWithFood = ps[PredicateEnum.isSimilarWithoutConsecutives](
    "foo",
    "food"
  );
  assert(fooWithFood);
  const lluuckWithLuck = ps[PredicateEnum.isSimilarWithoutConsecutives](
    "lluuck",
    "luckk"
  );
  assert(lluuckWithLuck);
  const ardvarkInElephant = ps[PredicateEnum.isSimilarWithoutConsecutives](
    "ardvark",
    "elephant"
  );
  assertEquals(ardvarkInElephant, false);
});

Deno.test("hasDiacriticsInOrder works", () => {
  const test1 = ps[PredicateEnum.hasDiacriticsInOrder]("ándrés", "andres");
  assert(test1);
  const test2 = ps[PredicateEnum.hasDiacriticsInOrder]("cliché", "cliche");
  assert(test2);
  const test3 = ps[PredicateEnum.hasDiacriticsInOrder]("naïve", "naive");
  assert(test3);
  const test4 = ps[PredicateEnum.hasDiacriticsInOrder](
    "são paulo",
    "sao paulo"
  );
  assert(test4);
  const test5 = ps[PredicateEnum.hasDiacriticsInOrder]("piñón", "pinon");
  assert(test5);
  const test6 = ps[PredicateEnum.hasDiacriticsInOrder]("cæsar", "caesar"); // not the best test
  assert(test6);
  const test7 = ps[PredicateEnum.hasDiacriticsInOrder]("françois", "franswa");
  assertEquals(test7, false);
});

Deno.test("isLongestStreak3orMore", () => {
  const t1 = ps[PredicateEnum.isLongestStreak3orMore]("stadium", "titanium");
  assert(t1);
  const t2 = ps[PredicateEnum.isLongestStreak3orMore]("tough", "stuff");
  assertEquals(t2, false);
});

Deno.test("isLongestStreak4orMore", () => {
  const t1 = ps[PredicateEnum.isLongestStreak4orMore](
    "mysterious",
    "victorious"
  );
  assert(t1);
  const t2 = ps[PredicateEnum.isLongestStreak3orMore]("tough", "stuff");
  assertEquals(t2, false);
});

Deno.test("has3OrMoreSharedLetters works", () => {
  const t1 = ps[PredicateEnum.has3OrMoreSharedLetters]("mars", "martes");
  assert(t1);
  const t2 = ps[PredicateEnum.has3OrMoreSharedLetters]("clap", "snap");
  assertEquals(t2, false);
});

Deno.test("areMoreThanHalfLettersShared works", () => {
  const shouldBeTrue = ps[PredicateEnum.areMoreThanHalfLettersShared](
    "foo",
    "food"
  );
  assert(shouldBeTrue);
  const shouldBeFalse = ps[PredicateEnum.areMoreThanHalfLettersShared](
    "bollywood",
    "baffled"
  );
  assertEquals(shouldBeFalse, false);
});

Deno.test("hasExactMatchWithoutVowels works", () => {
  const s1 = ps[PredicateEnum.hasExactMatchWithoutVowels]("moma", "mamá");
  assert(s1);
  const s2 = ps[PredicateEnum.hasExactMatchWithoutVowels]("mommma", "mamá");
  assertEquals(s2, false);
});

Deno.test("isDistanceLessThan50Percent works", () => {
  const t1 = ps[PredicateEnum.isDistanceLessThan50Percent](
    "0123456789",
    "01234"
  );
  assert(t1);
  const t2 = ps[PredicateEnum.isDistanceLessThan50Percent](
    "abcdefghij",
    "abcdeabcde"
  );
  assert(t2);
  const t3 = ps[PredicateEnum.isDistanceLessThan50Percent]("a", "abcdeabcde");
  assertEquals(t3, false);
});

Deno.test("isDistanceLessThan20Percent works", () => {
  const t1 = ps[PredicateEnum.isDistanceLessThan20Percent](
    "0123456789",
    "01234567"
  );
  assert(t1);
  const t2 = ps[PredicateEnum.isDistanceLessThan20Percent](
    "abcdefghij",
    "abcdefghyz"
  );
  assert(t2);
  const t3 = ps[PredicateEnum.isDistanceLessThan20Percent]("a", "abcdeabcde");
  assertEquals(t3, false);
});

Deno.test("isDistanceLessThan10Percent works", () => {
  const t1 = ps[PredicateEnum.isDistanceLessThan10Percent](
    "0123456789",
    "012345678"
  );
  assert(t1);
  const t2 = ps[PredicateEnum.isDistanceLessThan10Percent](
    "abcdefghij",
    "abcdefghiz"
  );
  assert(t2);
  const t3 = ps[PredicateEnum.isDistanceLessThan10Percent]("a", "abcdeabcde");
  assertEquals(t3, false);
});
