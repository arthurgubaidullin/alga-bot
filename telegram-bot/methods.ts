import axios from "axios";
import { getBotToken } from "./config";

export async function sendMessage(params: {
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
