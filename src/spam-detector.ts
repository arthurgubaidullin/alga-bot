import { spamPatterns } from "./spamPatterns";

export interface SpamDetector {
  isSpam(s: string): boolean;
}

export const spamDetector: SpamDetector = {
  isSpam,
};

export function isSpam(s: string): boolean {
  return spamPatterns.every((re) => re.test(s));
}
