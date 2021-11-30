import type { AxiosError } from "axios";
import type { NextApiHandler } from "next";
import { logError } from "../../../../logError";
import { program, Program } from "../../../../program";
import { validateBotToken } from "../../../../validateBotToken";

const handler =
  (P: Program): NextApiHandler =>
  async (req, res) => {
    try {
      const getWebhookInfo = P.post("getWebhookInfo");
      const setWebhook = P.post("setWebhook");

      const resp = await getWebhookInfo({});

      if (!resp.ok) {
        throw new Error(resp.description);
      }
      const url = resp.result.url;

      if (url === P.getBotWebhookURL()) {
        res.status(400).end();
        return;
      }

      await setWebhook({ url: P.getBotWebhookURL() });

      res.status(200).end();
    } catch (error) {
      logError(P)(error as AxiosError | Error);
      res.status(500).end();
    }
  };

export default validateBotToken(program)(handler);
