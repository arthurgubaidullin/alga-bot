const re = /\p{Emoji_Presentation}{3}\s.+18\+/gu;

export function isSpam(s: string): boolean {
  return re.test(s);
}
