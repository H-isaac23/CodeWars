import { Document, model } from "mongoose";
import { MODEL_MATCH } from "../constant/general";
import { matchSchema } from "./schemas/match";

export interface IMatch {
  player1: string;
  player2: string;
  win: string;
}

export interface MatchDoc extends Document, IMatch {}
export const MatchModel = model<MatchDoc>(MODEL_MATCH, matchSchema);
