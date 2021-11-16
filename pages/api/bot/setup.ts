import type { NextApiRequest, NextApiResponse } from "next";
import { getBotWebhookURL } from "../../../telegram-bot/config";
import { getWebhookInfo, setWebhook } from "../../../telegram-bot/methods";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = await getWebhookInfo();

  if (url === getBotWebhookURL()) {
    res.status(400).end();
    return;
  }

  await setWebhook();

  res.status(200).end();
}
