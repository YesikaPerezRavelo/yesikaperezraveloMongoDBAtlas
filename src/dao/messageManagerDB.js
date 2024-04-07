import MessageModel from "./models/messageModel.js";

class MessageManagerDB {
  async getAllMessages() {
    try {
      return await MessageModel.find().lean();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error fetching messages from database");
    }
  }

  async createMessage(user, message) {
    try {
      const newMessage = await MessageModel.create({ user, message });
      return newMessage.toObject();
    } catch (error) {
      console.error(error.message);
      throw new Error("Error creating new message");
    }
  }

  // Add other methods for updating, deleting messages as needed
}

export default MessageManagerDB;
