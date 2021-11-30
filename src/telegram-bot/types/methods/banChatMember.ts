import { Message } from "../Message";

export type BanChatMemberParams = {
  chat_id: number | string;
  user_id: number;
  revoke_messages?: boolean;
};

export type BanChatMemberReturns = Message;

export type BanChatMember = {
  banChatMember: {
    params: BanChatMemberParams;
    returns: BanChatMemberReturns;
  };
};
