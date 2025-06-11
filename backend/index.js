import express from "express";
const { json, urlencoded } = express;
import dotenv from "dotenv";
import logger from "morgan";
import { createServer } from "http";
import { connect } from "mongoose";
import cors from "cors";
import normalizePort from "./utils/normalizePort.js";
import { onError, onListening } from "./utils/appEvents.js";
import rootRouter from "./routers/root.route.js";
import authRouter from "./routers/auth.route.js";
import session from "express-session";
import cookieParser from "cookie-parser";

dotenv.config();

let __max = 0; // Biến max length cho log
if (process.env.DEVMODE) {
  (function () {
    const originalLog = console.log;
    function span(str) {
      if ((str?.length || 0) > __max) {
        __max = str?.length || __max;
        return "";
      }
      let res = "";
      for (let i = 0; i < __max - (str?.length || __max); i++) res += " ";
      return res;
    }

    console.log = function (...args) {
      const stack = new Error().stack?.split("\n");
      const caller = stack?.[2].match(/\((.*):(\d+):(\d+)\)/);
      if (caller) {
        const file = caller[1].split("\\").pop();
        const line = caller[2];
        const tmpLine = `\x1b[1m\x1b[34m${file}:\x1b[0m${line}`;
        const sp = span(tmpLine);
        originalLog.apply(console, [`[${tmpLine}${sp}]`, ...args]);
      } else {
        originalLog.apply(console, args);
      }
    };
  })();
}

const app = express();

//cookie-parser

app.use(cookieParser());

//session

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);
/**
 * Init mongoose.
 */
connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("🚀 Connected to MongoDB successfully!");
  })
  .catch((reason) => console.log(reason));

/**
 * Get port from .env and store in Express.
 */
const port = normalizePort(process.env.PORT || "8080");
app.set("port", port);

/**
 * Middleware setup.
 */
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173", //
    credentials: true,
    preflightContinue: true,
  })
);

/**
 * Routes setup.
 */
const apiPrefix = process.env.API_PREFIX;

app.use(rootRouter);

/**
 * Handle errors.
 */
app.use((err, _req, res, _next) => {
  console.error(err?.stack);
  res.status(500).json({
    message: "Internal Server Error!",
    stack: err?.message,
  });
});

app.use("/api/v1/auth", authRouter);

/**
 * Create HTTP server.
 */
const server = createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on("error", onError(port));
server.on("listening", onListening(server));
