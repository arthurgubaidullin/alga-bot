import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { getBotToken, getBotWebhookURL } from "../../../telegram-bot/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const resp = await axios.post<{ url?: string }>(
    `https://api.telegram.org/bot${getBotToken()}/getWebhookInfo`,
    {}
  );

  if (resp.data.url && resp.data.url === getBotWebhookURL()) {
    res.status(400).end();
    return;
  }

  await axios.post(`https://api.telegram.org/bot${getBotToken()}/setWebhook`, {
    url: getBotWebhookURL(),
  });
  res.status(200).end();
}