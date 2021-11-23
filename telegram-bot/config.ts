export function getBotToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN as string;
}

export function getBotWebhookURL(): string {
  const host = process.env.HOST;
  if (!host) {
    throw new Error("HOST enviroment variable not setted.");
  }
  return `https://${host}/api/bot/${getBotToken()}`;
}
