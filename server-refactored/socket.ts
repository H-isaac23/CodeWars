import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./interface/websocket";
import { v4 as uuidv4 } from "uuid";

const setupSocketServer = (server: HTTPServer): SocketIOServer => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  let currentRoomId = uuidv4() as string;
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

    socket.on("surrender", async ({ roomId, userId }) => {
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

    socket.on("queue", async (findMatch, username, stars) => {
      console.log({ username, stars });
      if (findMatch) {
        await socket.join("queueRoom");
      } else {
        await socket.leave("queueRoom");
      }
    });
  });

  io.of("/").adapter.on("leave-room", (room, id) => {
    console.log(`socket ${id} has left room ${room}`);
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  io.of("/").adapter.on("join-room", async (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
    if (room === "queueRoom") {
      const sockets = await io.in("queueRoom").fetchSockets();
      const socket_ids = sockets.map((s) => s.id);

      if (sockets.length == 2) {
        // should only work in "queueRoom"
        const s1 = io.sockets.sockets.get(socket_ids[0]) as Socket<
          ClientToServerEvents,
          ServerToClientEvents,
          InterServerEvents,
          SocketData
        >;
        const s2 = io.sockets.sockets.get(socket_ids[1]) as Socket<
          ClientToServerEvents,
          ServerToClientEvents,
          InterServerEvents,
          SocketData
        >;
        s1.emit("join_match", { currentRoomId, id: socket_ids[0] });
        s2.emit("join_match", { currentRoomId, id: socket_ids[1] });

        await s1.leave("queueRoom");
        await s2.leave("queueRoom");
        await s1.join(currentRoomId);
        await s2.join(currentRoomId);
        // possible that we need time delay to send the room id
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          currentRoomId = uuidv4() as string;
        }, 1000);
      }
      console.log(
        `Number of players in queue: ${
          (await io.in("queueRoom").fetchSockets()).length
        }`
      );
    }
  });

  io.of("/").adapter.on("leave-room", (room, id) => {
    console.log(`socket ${id} has left room ${room}`);
  });

  return io;
};

export default setupSocketServer;
