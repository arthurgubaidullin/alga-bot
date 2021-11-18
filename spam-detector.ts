const re = /\p{Emoji_Presentation}{3}\s.+/gu;

export function isSpam(s: string): boolean {
  return re.test(s);
}
