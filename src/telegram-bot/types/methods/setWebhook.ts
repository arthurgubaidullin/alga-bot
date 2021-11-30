import { WebhookInfo } from "../WebhookInfo";

type setWebhookParams = {
  url: string;
};

export type setWebhook = {
  setWebhook: {
    params: setWebhookParams;
    returns: WebhookInfo;
  };
};
