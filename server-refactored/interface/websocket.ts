import { IAccount } from "../models/account";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  match_result: ({
    msg,
    surrendered,
  }: {
    msg: string;
    surrendered: boolean;
  }) => Promise<void>;
  join_match: ({
    currentRoomId,
    id,
  }: {
    currentRoomId: string;
    id: string;
  }) => Promise<void>;
}

export interface ClientToServerEvents {
  queue: (
    findMatch: boolean,
    username: IAccount["username"],
    stars: IAccount["stars"]
  ) => void;
  surrender: ({
    roomId,
    userId,
  }: {
    roomId: string;
    userId: string;
  }) => Promise<void>;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
