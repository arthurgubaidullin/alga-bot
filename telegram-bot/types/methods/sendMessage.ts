import { Message } from "../Message";

type SendMessageParams = {
  chat_id: number;
  text: string;
  reply_to_message_id?: number;
};

type SendMessageReturns = Message;

export type SendMessage = {
  sendMessage: {
    params: SendMessageParams;
    returns: SendMessageReturns;
  };
};
