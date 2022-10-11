import { readKeypress } from "https://deno.land/x/keypress@0.0.8/mod.ts";
import { scoreMatches } from "./mod.ts";

const BR_WHITE = "\u001b[37;1m";
const BR_GREEN = "\u001b[32;1m";
const RESET_COLOR = "\u001b[0m";
const HIDE_CURSOR = "\x1B[?25l";
const SHOW_CURSOR = "\x1B[?25h";
const CLEAR_SCREEN = "\x1Bc";

const workBank = new TextDecoder("utf-8")
  .decode(Deno.readFileSync("./words/demo-words.txt"))
  .split("\n");

const getTopMatches = (input: string, maxMatches = 5) => {
  const matches = scoreMatches(input, workBank);
  return Object.entries(matches)
    .filter(([, score]) => score > 0)
    .slice(0, maxMatches)
    .map(([word]) => word);
};

const textEncoder = new TextEncoder();
const stdoutWrite = (plainText: string) =>
  Deno.stdout.write(textEncoder.encode(plainText));
const doNothing = () => stdoutWrite("");
const info = "Use ctl + c to exit";

console.log(`${BR_WHITE}Type something${RESET_COLOR}`);

let text = "";
for await (const keypress of readKeypress()) {
  if (keypress.ctrlKey && keypress.key === "c") {
    stdoutWrite(SHOW_CURSOR);
    Deno.exit(0);
  }

  if (!keypress.key?.length) await doNothing();
  else if (keypress.key.length > 1) {
    if (keypress.key === "backspace") text = text.slice(0, -1);
    if (keypress.key === "space") text = text += " ";
  } else {
    const lowercase = keypress.key.toLowerCase();
    text += lowercase;
  }

  const matches = getTopMatches(text);
  const matchString = BR_GREEN + matches.join("\n") + RESET_COLOR;
  const output = `${info}\n\n${text}\n\n${matchString}${HIDE_CURSOR}`;

  await stdoutWrite(CLEAR_SCREEN);
  await stdoutWrite(output);
}
