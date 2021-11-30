import type { NextApiRequest, NextApiResponse } from "next";
import { getBotWebhookURL } from "../../../../telegram-bot/config";
import { post } from "../../../../telegram-bot/post";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const getWebhookInfo = post.post("getWebhookInfo");
  const setWebhook = post.post("setWebhook");
  const resp = await getWebhookInfo({});

  if (!resp.ok) {
    throw new Error(resp.description);
  }
  const url = resp.result.url;

  if (url === getBotWebhookURL()) {
    res.status(400).end();
    return;
  }

  await setWebhook({ url: getBotWebhookURL() });

  res.status(200).end();
}
