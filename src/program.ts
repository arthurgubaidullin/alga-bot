import { Config, config } from "./config";
import { logger, Logger } from "./logger";
import { spamDetector, SpamDetector } from "./spam-detector";
import {
  makePost as telegramPost,
  TelegramPost,
} from "./telegram-bot/post";

export type Program = Logger &
  Config &
  TelegramPost &
  SpamDetector;

export const program: Program = {
  ...logger,
  ...config,
  ...telegramPost(config.getBotToken),
  ...spamDetector,
};
