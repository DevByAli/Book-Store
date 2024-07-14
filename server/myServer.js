import express from "express";
import { configDotenv } from "dotenv";
import { connectDB } from "./db/connect.db.js";
import cors from "cors";
import { cloudinaryConfig } from "./config/cloudinary.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { socketIOServer } from "./socket.io/socketServer.js";
import redisClientInstance from "./services/redis.service.js";
import { deleteNotifications } from "./services/notification.service.js";

configDotenv("dotenv");

const PORT = process.env.APP_SERVER_PORT || 50001;

export const app = express();

app.use(helmet());

app.set("view engine", "ejs");
app.set("views", "./templates");

cloudinaryConfig();
deleteNotifications()

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.listen(PORT, () => {
  connectDB();
  redisClientInstance.connect();
  socketIOServer();
  console.log(`App Server is listening on PORT: ${PORT}`);
});
