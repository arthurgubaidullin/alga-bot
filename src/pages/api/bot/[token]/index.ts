import type { AxiosError } from "axios";
import type {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { logError } from "../../../../logError";
import { program, Program } from "../../../../program";
import { Update } from "../../../../telegram-bot/types/Update";
import * as theBot from "../../../../the-bot";
import { validateBotToken } from "../../../../validateBotToken";

const makeHandler =
  (P: Program): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const update = req.body as Update;

      P.log("Update", update);

      await theBot.handleUpdate(P)(update);

      res.status(200).end();
    } catch (error: unknown) {
      logError(P)(error as AxiosError | Error);

      res.status(500).end();
    }
  };

export default validateBotToken(program)(makeHandler);
