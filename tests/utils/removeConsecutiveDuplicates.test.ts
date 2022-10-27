import { assertEquals } from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { removeConsecutiveDuplicates } from "../../utils/removeConsecutiveDuplicates.ts";

Deno.test("removeConsecutiveDuplicates works", () => {
  const t1 = removeConsecutiveDuplicates("food");
  assertEquals(t1, "fod");
  const t2 = removeConsecutiveDuplicates("fffreeeedddoom");
  assertEquals(t2, "fredom");
});
