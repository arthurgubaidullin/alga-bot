export function getBotToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN as string;
}

export function getBotWebhookURL(): string {
  return `https://inspiring-jepsen-4b9b8f.netlify.app/bot/${getBotToken()}`;
}
