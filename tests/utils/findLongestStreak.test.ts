import { assertEquals } from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { findLongestStreak } from "../../utils/findLongestStreak.ts";

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
