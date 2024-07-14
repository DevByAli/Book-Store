import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { configDotenv } from "dotenv";
import { createNotification } from "../services/notification.service.js";
import socketModel from "../models/socket.model.js";
import deleteAllSocketData from "../services/socket.service.js";

configDotenv("dotenv");

const PORT = process.env.WEB_SOCKET_SERVER_PORT;

const app = express();
const httpServer = createServer(app);

const socketServer = new Server(httpServer, {
  transports: ["websocket"],
  cors: {
    origin: "*",
  },
});

let adminSocketId = null;

export const socketIOServer = () => {
  socketServer.on("connection", (socket) => {
    console.log("User connected");

    socket.on("registerUser", async ({ role, userId }) => {
      if (role === "admin") {
        adminSocketId = socket.id;
      } else {
        await socketModel.create({ userId, socketId: socket.id });
      }
    });

    socket.on("newOrder", async ({ userId, orderId }, callback) => {
      const notification = await createNotification(userId, orderId);

      socketServer
        .to(socket.id)
        .timeout(5000)
        .emit("newNotification", notification);

      if (adminSocketId) {
        socketServer
          .to(adminSocketId)
          .timeout(5000)
          .emit("newNotification", notification);
      }

      callback({
        status: true,
        msg: "Notification Received",
      });
    });

    socket.on(
      "changeOrderStatus",
      async ({ userId, role, orderId }, callback) => {
        const notification = await createNotification(userId, orderId, "CS");

        // if order status changed by admin
        if (role === "admin") {
          const result = await socketModel.findOne({ userId });

          const socketId = result ? result.socketId : null;

          // if user is online
          if (socketId) {
            socketServer
              .to(socketId)
              .timeout(5000)
              .emit("newNotification", notification);
          }
        }
        // if order status changed by user
        else if (adminSocketId && role === "user") {
          socketServer
            .to(adminSocketId)
            .timeout(5000)
            .emit("newNotification", notification);
        }

        callback({
          status: true,
          msg: "Notification Received",
        });
      }
    );

    socket.on("disconnect", async () => {
      if (socket.id === adminSocketId) {
        adminSocketId = null;
      } else {
        console.log(await socketModel.deleteMany({ socketId: socket.id }));
      }
      console.log("User disconnect");
    });
  });

  httpServer.listen(PORT, () => {
    deleteAllSocketData()
    console.log(`Web Socket server is listening on PORT ${PORT}`);
  });
};
