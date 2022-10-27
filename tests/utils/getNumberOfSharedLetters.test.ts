import { assertEquals } from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { getNumberOfSharedLetters } from "../../utils/getNumberOfSharedLetters.ts";

Deno.test("getNumberOfSharedLetters works", () => {
  const five = getNumberOfSharedLetters("abcde", "a blue cow drank");
  assertEquals(five, 5);
  const two = getNumberOfSharedLetters("foo", "food");
  assertEquals(two, 2);
});
