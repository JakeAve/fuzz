import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { Factors, predicates as ps } from "./mod.ts";

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
