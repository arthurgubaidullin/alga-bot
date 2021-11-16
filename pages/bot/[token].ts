import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type User = {
  id: number;
  is_bot: boolean;
};

type Chat = {
  id: number;
};

type Message = {
  message_id: number;
  from?: User;
  text?: string;
  chat?: Chat;
};

type Update = {
  message?: Message;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token } = req.query;

  if (token !== getBotToken()) {
    res.status(403).end();
    return;
  }

  const update = req.body as Update;

  if (typeof update === "string") {
    console.log("oops!");
    res.status(200).end();
    return;
  }

  console.log(update);

  if (
    update.message &&
    update.message.chat &&
    update.message.from &&
    update.message.text &&
    !update.message.from.is_bot
  ) {
    // send echo
    await sendMessage({
      chatId: update.message.chat.id,
      text: update.message.text,
      replyToMessageId: update.message.message_id,
    });
  }

  res.status(200).end();
}

async function sendMessage(params: {
  chatId: number;
  text: string;
  replyToMessageId?: number;
}): Promise<void> {
  await axios.post(`https://api.telegram.org/bot${getBotToken()}/sendMessage`, {
    chat_id: params.chatId,
    text: params.text,
    ...(params.replyToMessageId
      ? { reply_to_message_id: params.replyToMessageId }
      : {}),
  });
}

function getBotToken(): string {
  return process.env.TELEGRAM_BOT_TOKEN as string;
}
