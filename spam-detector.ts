const re = /(\p{Extended_Pictographic}.?){3}\s.+/gu;

export function isSpam(s: string): boolean {
  return re.test(s);
}
