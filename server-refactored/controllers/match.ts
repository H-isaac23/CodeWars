import { MatchDoc } from "../models/match";
import { getAllMatches } from "../services/match";
import {
  responseInternalServerError,
  responseSuccess,
} from "../utils/response";
import { postNewMatch } from "../services/match";
import { CustomBodyRequest } from "../interface/controller";
import { CreateNewMatchParameter } from "../interface/service";
import { Request, Response } from "express";
import { isString } from "../utils/validate";

export const getAllMatchesController = async (_req: Request, res: Response) => {
  try {
    const matches: MatchDoc[] = await getAllMatches();
    return responseSuccess(res, matches);
  } catch (error: unknown) {
    let errorMessage = "";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    return responseInternalServerError(res, errorMessage, error);
  }
};

export const postNewMatchController = async (
  req: CustomBodyRequest<CreateNewMatchParameter>,
  res: Response
) => {
  try {
    const { player1, player2, win } = req.body;

    if (!(player1 && player2 && win)) {
      throw new TypeError("player1, player2, and win parameter is required");
    }

    if (!isString(player1)) throw new TypeError("player1 must be a string");
    if (!isString(player2)) throw new TypeError("player2 must be a string");
    if (!isString(win)) throw new TypeError("win must be a string");

    const savedMatch = await postNewMatch({ player1, player2, win });

    return responseSuccess(res, savedMatch);
  } catch (error: unknown) {
    let errorMessage = "";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    return responseInternalServerError(res, errorMessage, error);
  }
};
