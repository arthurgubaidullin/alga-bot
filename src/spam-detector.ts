const re = /(\p{Extended_Pictographic}.?){3}\s.+/gu;

export interface SpamDetector {
  isSpam(s: string): boolean;
}

export const spamDetector: SpamDetector = {
  isSpam,
};

export function isSpam(s: string): boolean {
  return re.test(s);
}
