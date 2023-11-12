import { IAccount } from "../models/account";

export interface BaseAccountRequest {
  username: IAccount["username"];
}

export interface CreateAccountParameter extends BaseAccountRequest {
  email: IAccount["email"];
  password: string;
}

export interface UpdateAccountStarsParameter extends BaseAccountRequest {
  hasStarProtection: IAccount["hasStarProtection"];
  didWin: boolean;
  stars: IAccount["stars"];
}

export interface UpdateAccountPasswordParameter extends BaseAccountRequest {
  newPassword: string;
}

export interface UpdateAccountGoldParameter extends BaseAccountRequest {
  gold: IAccount["gold"];
  goldUpdateAmount: number;
}

export interface LoginParameter extends BaseAccountRequest {
  password: string;
}

export interface SendEmailNotifParameter {
  email: IAccount["email"];
}
