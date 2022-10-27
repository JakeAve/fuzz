import { assertEquals } from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { replaceVowels } from "../../utils/replaceVowels.ts";

Deno.test("replaceVowels works", () => {
  const t1 = replaceVowels("school");
  assertEquals(t1, "sch  l");
  const t2 = replaceVowels("taylor");
  assertEquals(t2, "t yl r");
});

Deno.test("replaceVowels works with diacritics", () => {
  const t1 = replaceVowels("mamá");
  assertEquals(t1, "m m ");
});
