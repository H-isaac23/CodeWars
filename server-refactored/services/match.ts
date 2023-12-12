import { MatchDoc, MatchModel, IMatch } from "../models/match";
import { CreateNewMatchParameter } from "../interface/service";

export const getAllMatches = async (): Promise<MatchDoc[]> => {
  return MatchModel.find({});
};

export const postNewMatch = async ({
  player1,
  player2,
  win,
}: CreateNewMatchParameter): Promise<MatchDoc> => {
  const data: IMatch = {
    player1,
    player2,
    win,
  };

  const match = new MatchModel(data);
  const savedMatch = await match.save();

  return savedMatch;
};
