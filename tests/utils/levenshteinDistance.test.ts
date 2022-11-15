import { levenshteinDistance } from "../../utils/levenshteinDistance.ts";
import { assertEquals } from "https://deno.land/std@0.159.0/testing/asserts.ts";

Deno.test("levenshteinDistance", () => {
  const t1 = levenshteinDistance("fast", "faster");
  assertEquals(t1, 2);

  const t2 = levenshteinDistance("fast", "fastest");
  assertEquals(t2, 3);

  const t3 = levenshteinDistance("", "mamá");
  assertEquals(t3, 4);
});
