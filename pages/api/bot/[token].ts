import { cert, initializeApp, getApp, getApps, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { getBotToken } from "../../../telegram-bot/config";
import { sendMessage } from "../../../telegram-bot/methods";
import { Update } from "../../../telegram-bot/types/Update";

let firebaseApp: App | null = null;

function getFirebaseApp() {
  if (firebaseApp === null) {
    firebaseApp = initializeApp({
      projectId: "codelabs-36517",
      credential: cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
      ),
      databaseURL: "https://codelabs-36517.firebaseio.com",
    });
  }
  return firebaseApp;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query?.token && req.query.token !== getBotToken()) {
    res.status(403).end();
    return;
  }

  const update = req.body as Update | undefined;

  if (typeof update === "string") {
    console.log("oops!");
    res.status(200).end();
    return;
  }

  console.log(update);

  {
    const app = getFirebaseApp();
    const db = getFirestore(app);
    if (update) {
      await db.collection("telegram_updates").add(update);
    }
  }

  if (
    update &&
    update.message &&
    update.message.chat &&
    update.message.from &&
    update.message.text &&
    !update.message.from.is_bot &&
    update.message.chat.type === "private"
  ) {
    // send echo
    console.log("echo");
    await sendMessage({
      chatId: update.message.chat.id,
      text: update.message.text,
      replyToMessageId: update.message.message_id,
    });
  }

  res.status(200).end();
}
