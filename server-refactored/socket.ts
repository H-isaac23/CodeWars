import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  QueuePlayer,
} from "./interface/websocket";
import { v4 as uuidv4 } from "uuid";
import { runCode } from "./pythonInterpreter";

const setupSocketServer = (server: HTTPServer): SocketIOServer => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-type-assertion
  let currentRoomId = uuidv4() as string;
  let playersOnQueue: Array<QueuePlayer> = [];
  const io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    path: "/socket",
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    console.log(io.of("/").sockets.keys());
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
    socket.on(
      "match_submit",
      async ({ username, roomId, code, socketId, questionDetails, buffs }) => {
        const total = questionDetails.testCases.length;
        let correct = 0;
        const runCodePromises = questionDetails.testCases.map(
          async (testCase) => {
            const toRun = code + "\n" + testCase.exe;
            const res = await runCode(toRun);
            console.log({ res, answer: testCase.answer });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            if (res === testCase.answer || res.trim() === "True") {
              correct += 1;
            }
          }
        );
        await Promise.all(runCodePromises);

        console.log({ correct });
        if (total === correct) {
          const index = Math.floor(Math.random() * 20);

          io.to(roomId).emit("player_code_submit", {
            correct: true,
            socketId,
            questionIndex: index,
            playerUsername: username,
            buffs,
          });

          console.log(index);
        } else {
          io.to(roomId).emit("player_code_submit", {
            correct: false,
            socketId,
            questionIndex: -1,
            playerUsername: username,
            buffs,
          });
        }
      }
    );

    socket.on("surrender", async ({ roomId, userId }) => {
      console.log("there should be things here");
      console.log({ roomId, userId });

      const sockets = await io.in(roomId).fetchSockets();
      const socket_ids = sockets.map((s) => s.id);

      const loserIndex = socket_ids.indexOf(userId);
      const winnerIndex = 1 - loserIndex;
      const winner = io.sockets.sockets.get(socket_ids[winnerIndex]) as Socket<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
      >;
      const loser = io.sockets.sockets.get(socket_ids[loserIndex]) as Socket<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
      >;

      winner.emit("match_result", { msg: "You won!", surrendered: false });
      loser.emit("match_result", { msg: "You lost", surrendered: true });
      await winner.leave(roomId);
      await loser.leave(roomId);
    });

    socket.on("queue", async ({ findMatch, username, stars }) => {
      console.log({ username, stars });
      if (findMatch) {
        playersOnQueue.push({ socketId: socket.id, username, stars });
        await socket.join("queueRoom");
      } else {
        await socket.leave("queueRoom");
      }
    });

    socket.on("player_lose", ({ room_id, socketId }) => {
      console.log("hello bits");
      console.log(socketId);
      io.to(room_id).emit("match_end", { loser: socketId });
    });
  });

  io.of("/").adapter.on("leave-room", (room, id) => {
    // TODO: REMOVE PLAYERS FROM ARRAY AFTER LEAVING ROOM
    if (room === "queueRoom") {
      playersOnQueue = playersOnQueue.filter((player) => {
        return player.socketId !== id;
      });
      console.log(playersOnQueue);
    }
    console.log(`socket ${id} has left room ${room}`);
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
  });

  io.of("/").adapter.on("leave-room", (room, id) => {
    console.log(`socket ${id} has left room ${room}`);
  });

  const periodicMatching = async () => {
    // console.log(playersOnQueue);
    const sockets = await io.in("queueRoom").fetchSockets();
    // const socket_ids = sockets.map((s) => s.id);

    if (sockets.length >= 2) {
      // TODO: SHOULD SORT THE ARRAY FIRST
      playersOnQueue.sort((p1, p2) => p1.stars - p2.stars);
      console.log(playersOnQueue);

      let i = 0;
      while (i <= playersOnQueue.length - 2 && playersOnQueue.length >= 2) {
        // TODO: COMPARE STARS, IF NOT WITHIN BRACKET, INCREMENT BY 1, ELSE DO MATCH
        console.log({ i });
        console.log(playersOnQueue[i].stars - playersOnQueue[i + 1].stars);
        if (i > playersOnQueue.length - 2) {
          break;
        }
        if (
          Math.abs(playersOnQueue[i].stars - playersOnQueue[i + 1].stars) > 25
        ) {
          i += 1;
          console.log({ i }, "after incrementing");
          continue;
        }

        const player_one = playersOnQueue[i];
        const player_two = playersOnQueue[i + 1];

        // should only work in "queueRoom"
        const s1 = io.sockets.sockets.get(player_one.socketId) as Socket<
          ClientToServerEvents,
          ServerToClientEvents,
          InterServerEvents,
          SocketData
        >;
        const s2 = io.sockets.sockets.get(player_two.socketId) as Socket<
          ClientToServerEvents,
          ServerToClientEvents,
          InterServerEvents,
          SocketData
        >;

        const username1 = player_one.username;
        const username2 = player_two.username;

        s1.emit("join_match", {
          currentRoomId,
          id: player_one.socketId,
          username: [username1, username2],
        });
        s2.emit("join_match", {
          currentRoomId,
          id: player_two.socketId,
          username: [username1, username2],
        });

        console.log({ username1, username2 });

        await s1.leave("queueRoom");
        await s2.leave("queueRoom");
        await s1.join(currentRoomId);
        await s2.join(currentRoomId);
        // possible that we need time delay to send the room id
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          currentRoomId = uuidv4();
        }, 300);
        // i += 1;
        i = 0;
      }
    }
    console.log(
      `Number of players in queue: ${
        (await io.in("queueRoom").fetchSockets()).length
      }`
    );

    return;
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(periodicMatching, 5000);

  return io;
};

export default setupSocketServer;
