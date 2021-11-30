import { NextApiHandler } from "next";
import { Program } from "./program";

export type validateBotToken = (
  P: Program
) => (
  makeHandler: (P: Program) => NextApiHandler
) => NextApiHandler;

export const validateBotToken: validateBotToken = (P) => {
  return (makeHandler) => async (req, res) => {
    if (req.query?.token && req.query.token !== P.getBotToken()) {
      res.status(403).end();
      return;
    }
    return makeHandler(P)(req, res);
  };
};
