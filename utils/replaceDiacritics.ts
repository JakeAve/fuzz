interface Letters {
  [key: string]: RegExp;
}

const letters: Letters = {
  a: /à|á|â|ä|æ|ã|å|ā/g,
  //   b: "b",
  c: /ç|ć|č/g,
  d: /đ|ď/g,
  e: /è|é|ê|ë|ē|ė|ę/g,
  //   f: "f",
  //   g: "g",
  //   h: "h",
  i: /î|ï|í|ī|į|ì/g,
  //   j: "j",
  //   k: "k",
  l: /ł/g,
  //   m: "m",
  n: /ñ|ń/,
  o: /ô|ö|ò|ó|œ|ø|ō|õ/g,
  //   p: "p",
  //   q: "q",
  r: /ř/g,
  s: /ß|ś|š/g,
  t: /ť/g,
  u: /û|ü|ù|ú|ū/g,
  //   v: "v",
  //   w: "w",
  //   x: "x",
  y: /ÿ|ý/g,
  z: /ž|ź|ż/g,
};

export const replaceDiacritics = (input: string) => {
  for (const l in letters) input = input.replace(letters[l], l);
  return input;
};
