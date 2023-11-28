import { MatchDoc, MatchModel } from "../models/match";

export const getAllMatches = async (): Promise<MatchDoc[]> => {
  return MatchModel.find({});
};
