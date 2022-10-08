export const removeConsecutiveDuplicates = (s: string) => {
  const n = s.length;
  let str = "";
  if (n == 0) return str;

  for (let i = 0; i < n - 1; i++) {
    if (s[i] != s[i + 1]) {
      str += s[i];
    }
  }

  str += s[n - 1];
  return str;
};
