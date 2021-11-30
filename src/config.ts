export interface GetBotToken {
  getBotToken(): string;
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;

const getBotToken: GetBotToken = {
  getBotToken(): string {
    if (!botToken) {
      throw new Error(
        "TELEGRAM_BOT_TOKEN enviroment variable not setted."
      );
    }
    return botToken;
  },
};

export interface GetBotWebhookURL {
  getBotWebhookURL(): string;
}

const host = process.env.HOST;

export const getBotWebhookURL: GetBotWebhookURL = {
  getBotWebhookURL() {
    if (!host) {
      throw new Error("HOST enviroment variable not setted.");
    }
    return `https://${host}/api/bot/${getBotToken.getBotToken()}`;
  },
};

export type Config = GetBotToken & GetBotWebhookURL;

export const config: Config = {
  ...getBotToken,
  ...getBotWebhookURL,
};
