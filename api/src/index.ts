import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";

import passport from "./config/passport";
import { swaggerSpec } from "./config/swagger";

import authRouter from "./routes/authRouter";
import eventsRouter from "./routes/eventsRouter";
import session from "express-session";
import { env } from "./config/env";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(bodyParser.json());

app.use(session({ secret: env.session.secret, resave: true, saveUninitialized: true, cookie: { maxAge: 24 * 60 * 60 * 1000 } }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);

export default app;
