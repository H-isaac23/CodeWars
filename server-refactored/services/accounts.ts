import { AccountDoc, IAccount, AccountModel } from "../models/account";
import {
  CreateAccountParameter,
  UpdateAccountStarsParameter,
  UpdateAccountGoldParameter,
  BaseAccountRequest,
} from "../interface/service";
import bcrypt from "bcrypt";

export const getAllAccounts = async (): Promise<AccountDoc[]> => {
  return AccountModel.find({});
};

export const createAccount = async ({
  username,
  email,
  password,
}: CreateAccountParameter): Promise<AccountDoc> => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const data: IAccount = {
    username,
    email,
    passwordHash,
    gold: 100,
    stars: 50,
    hasStarProtection: false,
  };

  const account = new AccountModel(data);
  const savedAccount = await account.save();

  return savedAccount;
};

export const getUniqueAccount = async ({
  username,
}: BaseAccountRequest): Promise<AccountDoc | null> => {
  const account = await AccountModel.findOne({ username });
  return account;
};

export const updateAccountStars = async ({
  username,
  hasStarProtection,
  didWin,
  stars,
}: UpdateAccountStarsParameter): Promise<AccountDoc | null> => {
  let starUpdate = stars;
  if (hasStarProtection) {
    return await AccountModel.findOne({ username });
  }
  starUpdate = didWin ? Number(stars) + 1 : Number(stars) - 1;
  const updatedUserStars = await AccountModel.findOneAndUpdate(
    { username: username },
    { stars: starUpdate },
    {
      new: true,
    }
  );

  return updatedUserStars;
};

export const updateAccountGold = async ({
  username,
  gold,
  goldUpdateAmount,
}: UpdateAccountGoldParameter): Promise<AccountDoc | null> => {
  const updatedAccount = AccountModel.findOneAndUpdate(
    { username: username },
    { gold: gold + goldUpdateAmount },
    { new: true }
  );

  return updatedAccount;
};
