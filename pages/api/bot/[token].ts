import { Axios, AxiosError } from "axios";
import { getFirestore } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { getBotToken } from "../../../telegram-bot/config";
import { Update } from "../../../telegram-bot/types/Update";
import { logError } from "../../../logError";
import { echoInPrivateChat } from "../../../tasks/echoInPrivateChat";
import { findAndBanSpammers } from "../../../tasks/findAndBanSpammers";
import { logUpdateToFirestore } from "../../../tasks/logUpdateToFirestore";
import { getFirebaseApp } from "../../../firebaseApp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.query?.token && req.query.token !== getBotToken()) {
      res.status(403).end();
      return;
    }

    const app = getFirebaseApp();
    const db = getFirestore(app);

    const update = req.body as Update;

    console.log("Update", update);

    const findAndBanSpammerTask = findAndBanSpammers(db, update);
    const logUpdateTask = logUpdateToFirestore(db, update);
    const echoInPrivateChatTask = echoInPrivateChat(update);

    await Promise.all([
      logUpdateTask,
      findAndBanSpammerTask,
      echoInPrivateChatTask,
    ]);

    res.status(200).end();
  } catch (error: unknown) {
    logError(error as AxiosError | Error);

    // console.error(error);
    res.status(500).end();
  }
}
