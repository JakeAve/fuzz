import { assertEquals } from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { replaceDiacritics } from "../../utils/replaceDiacritics.ts";

Deno.test("getNumberOfSharedLetters works", () => {
  const t1 = replaceDiacritics("mamá");
  assertEquals(t1, "mama");

  const t2 = replaceDiacritics("el niño");
  assertEquals(t2, "el nino");

  const t3 = replaceDiacritics("cæsar");
  assertEquals(t3, "casar");
});
