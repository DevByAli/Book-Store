import { StatusCodes } from "http-status-codes";
import { ErrorMiddleware } from "./middlewares/error.middleware.js";
import { app } from "./myServer.js";
import {
  bookRouter,
  orderRouter,
  userRouter,
  cartRouter,
  authRouter,
  statsRouter,
  tagRouter,
  notificationRouter,
} from "./router/index.js";

app.use(
  "/api/v1",
  bookRouter,
  orderRouter,
  userRouter,
  cartRouter,
  authRouter,
  statsRouter,
  tagRouter,
  notificationRouter
);

app.use("*", (req, res) => {
  res
    .status(StatusCodes.BAD_REQUEST)
    .json({ success: false, msg: "Invalid route" });
});

app.use(ErrorMiddleware);
