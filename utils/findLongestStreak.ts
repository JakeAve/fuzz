export const findLongestStreak = (input: string, string: string) => {
  let match = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < string.length; j++) {
      if (string[j] === input[i]) {
        let m = 0;
        let ii = i;
        let jj = j;
        while (
          string[jj] === input[ii] &&
          jj < string.length &&
          ii < string.length
        ) {
          m++;
          match = Math.max(m, match);
          jj++;
          ii++;
        }
      }
    }
  }
  return match;
};
