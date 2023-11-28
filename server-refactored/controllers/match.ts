import { MatchDoc } from "../models/match";
import { getAllMatches } from "../services/match";
import {
  responseInternalServerError,
  responseSuccess,
} from "../utils/response";
import { Request, Response } from "express";

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
