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
    username,
  }: {
    currentRoomId: string;
    id: string;
    username: Array<IAccount["username"] | undefined>;
  }) => Promise<void>;
}

export interface ClientToServerEvents {
  queue: ({
    findMatch,
    username,
    stars,
  }: {
    findMatch: boolean;
    username: IAccount["username"];
    stars: IAccount["stars"];
  }) => void;
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

export interface QueuePlayer {
  socketId: string;
  username: IAccount["username"];
  stars: IAccount["stars"];
}
