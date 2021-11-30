type deleteMessageParams = {
  chat_id: number | string;
  message_id: number;
};

export type DeleteMessage = {
  deleteMessage: {
    params: deleteMessageParams;
    returns: boolean;
  };
};
