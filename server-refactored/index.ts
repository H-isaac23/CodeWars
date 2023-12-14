import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import route from "./route";
import initDB from "./db";
import setupSocketServer from "./socket";
import http from "http";
import { createServer } from "https";
import { STATUS_DB_CONNECTED } from "./constant/general";
dotenv.config();

const PORT = process.env.PORT ?? 5000;
const DB_URI = process.env.MONGODB_URI_TEST ?? "";
const DEBUG = process.env.DEBUG === "TRUE" ? true : false;
const NODE_ENV = process.env.NODE_ENV;

async function startServer() {
  try {
    // this app
    const app: express.Application = express();

    // CORS middleware for allowing cross-origin requests
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    app.use(cors());

    // JSON middleware for parse all incoming request as JSON
    app.use(express.json());

    // Morgan middleware for logging HTTP request
    // app.use(morganMiddleware)

    // Rate limiting middleware. Rate limits all requests by IP using in-memory table
    // app.use("/public/v1/create");

    // Apply the routes
    app.use("/public/v1", route());

    // Init DB
    const dbInitStatus = await initDB(DB_URI);
    if (dbInitStatus === STATUS_DB_CONNECTED) {
      if (DEBUG) {
        console.debug(`DB successfully connected`);
      }
    }

    // options for https server
    // const options = {
    //   key: readFileSync(KEY),
    //   cert: readFileSync(CERT),
    // };
    const options = {};
    const server = http.createServer(app);
    setupSocketServer(server);

    // Start the server
    if (NODE_ENV === "development") {
      // dev mode use http server
      server.listen(PORT, () => {
        console.info(
          `Backend service listening on http://localhost:${PORT} in ${NODE_ENV} mode`
        );
      });
    } else if (NODE_ENV === "production") {
      // prod mode use https server
      createServer(options, app).listen(PORT, () => {
        console.info(
          `Backend service listening on https://localhost:${PORT} in ${NODE_ENV} mode`
        );
      });
    }
  } catch (error: unknown) {
    console.error(error);
  }
}

// Start this apps
void (async () => {
  await startServer();
})();
