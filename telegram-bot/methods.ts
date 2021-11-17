import axios from "axios";
import { getBotToken, getBotWebhookURL } from "./config";
import { Response } from "./types/Response";

type WebhookInfo = {
  url: string;
};

export async function sendMessage(params: {
  chatId: number;
  text: string;
  replyToMessageId?: number;
}): Promise<void> {
  await axios.post<Response<WebhookInfo>>(method("sendMessage"), {
    chat_id: params.chatId,
    text: params.text,
    ...(params.replyToMessageId
      ? { reply_to_message_id: params.replyToMessageId }
      : {}),
  });
}

export async function getWebhookInfo(): Promise<string> {
  const resp = await axios.post<Response<WebhookInfo>>(
    method("getWebhookInfo"),
    {}
  );

  if (!resp.data.ok) {
    throw new Error(resp.data.description);
  }

  return resp.data.result.url;
}

export async function setWebhook(): Promise<void> {
  await axios.post<Response<WebhookInfo>>(method("setWebhook"), {
    url: getBotWebhookURL(),
  });
}

export async function banChatMember(params: {
  chatId: number | string;
  userId: number;
  revokeMessages?: boolean;
}): Promise<void> {
  await axios.post<Response<any>>(method("banChatMember"), {
    chat_id: params.chatId,
    user_id: params.userId,
    ...(params.revokeMessages
      ? { revoke_messages: params.revokeMessages }
      : {}),
  });
}

function method(
  name: "banChatMember" | "getWebhookInfo" | "sendMessage" | "setWebhook"
) {
  return `https://api.telegram.org/bot${getBotToken()}/${name}` as const;
}
