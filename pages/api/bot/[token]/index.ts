import { AxiosError } from "axios";
import type {
  NextApiRequest,
  NextApiResponse,
  NextApiHandler,
} from "next";
import { logError } from "../../../../logError";
import { getBotToken } from "../../../../telegram-bot/config";
import { Update } from "../../../../telegram-bot/types/Update";
import * as theBot from "../../../../the-bot";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const update = req.body as Update;

    console.log("Update", update);

    await theBot.handleUpdate(update);

    res.status(200).end();
  } catch (error: unknown) {
    logError(error as AxiosError | Error);

    // console.error(error);
    res.status(500).end();
  }
}

export default validateBotToken(handler);

function validateBotToken(
  handler: NextApiHandler
): NextApiHandler {
  return async (req, res) => {
    if (req.query?.token && req.query.token !== getBotToken()) {
      res.status(403).end();
      return;
    }
    return handler(req, res);
  };
}
