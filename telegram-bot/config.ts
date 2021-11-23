export function getBotToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN as string;
}

const host = process.env.HOST;

export function getBotWebhookURL(): string {
  if (!host) {
    throw new Error("HOST enviroment variable not setted.");
  }
  return `https://${host}/api/bot/${getBotToken()}`;
}

const groupId = process.env.TELEGRAM_GROUP_ID;

export function getGroupId(): string {
  if (!groupId) {
    throw new Error("TELEGRAM_GROUP_ID enviroment variable not setted.");
  }
  return groupId;
}

const ownerUserName = process.env.TELEGRAM_GROUP_OWNER_USERNAME;

export function getOwnerUserName(): string {
  if (!ownerUserName) {
    throw new Error(
      "TELEGRAM_GROUP_OWNER_USERNAME enviroment variable not setted."
    );
  }
  return ownerUserName;
}
