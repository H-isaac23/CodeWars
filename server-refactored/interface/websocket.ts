import { IAccount } from "../models/account";

interface TestCase {
  exe: string;
  answer: string;
}

type Buffs = "reflect" | "heal" | "damage";

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
  player_code_submit: ({
    correct,
    socketId,
    questionIndex,
    playerUsername,
    buffs,
  }: {
    correct: boolean;
    socketId: string;
    questionIndex: number;
    playerUsername: IAccount["username"];
    buffs: Array<Buffs>;
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
  match_submit: ({
    username,
    roomId,
    code,
    socketId,
    questionDetails,
    buffs,
  }: {
    username: IAccount["username"];
    roomId: string;
    code: string;
    socketId: string;
    questionDetails: {
      question: string;
      template: string;
      testCases: Array<TestCase>;
    };
    buffs: Array<Buffs>;
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
