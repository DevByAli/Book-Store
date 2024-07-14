import SocketModel from "../models/socket.model.js";

const deleteAllSocketData = async () => {
  try {
    await SocketModel.deleteMany({});
    console.log("All socket data deleted successfully.");
  } catch (error) {
    console.error("Error deleting socket data:", error);
  }
};

export default deleteAllSocketData;
