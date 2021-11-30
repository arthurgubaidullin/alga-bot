export interface BotConfig {
  getBotToken(): string;
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;

const botConfig: BotConfig = {
  getBotToken(): string {
    if (!botToken) {
      throw new Error(
        "TELEGRAM_BOT_TOKEN enviroment variable not setted."
      );
    }
    return botToken;
  },
};

export type Config = BotConfig;

export const config: Config = { ...botConfig };
