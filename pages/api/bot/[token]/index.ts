import { AxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { logError } from "../../../../logError";
import { getBotToken } from "../../../../telegram-bot/config";
import { Update } from "../../../../telegram-bot/types/Update";
import * as theBot from "../../../../the-bot";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.query?.token && req.query.token !== getBotToken()) {
      res.status(403).end();
      return;
    }

    const update = req.body as Update;

    console.log("Update", update);

    await theBot.handleUpdate(update);

    res.status(200).end();
  } catch (error: unknown) {
    logError(error as AxiosError | Error);

    // console.error(error);
    res.status(500).end();
  }
}
