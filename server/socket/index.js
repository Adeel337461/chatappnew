import express from "express";
import http from "http";
import { Server } from "socket.io";
import getUserDetailsFromToken from "../utils/getUserDetailsFromToken.js";
import UserModel from "../models/user.model.js";
import { ConversationModel, MessageModel } from '../models/ConversationModel.js';
import getConversation from '../utils/getConversation.js'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

let onlineUsers = new Map();

io.on("connection", async (socket) => {
  try {
    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    if (!user || !user._id) {
      console.log("❌ Invalid user");
      socket.disconnect(true);
      return;
    }

    const userId = user._id.toString();

    onlineUsers.set(userId, socket.id);
    socket.join(userId);

    io.emit("onlineUser", Array.from(onlineUsers.keys()));
    console.log(`✅ User online: ${userId}`);

    socket.on('message-page', async (userId) => {
      console.log('userId', userId)
      const userDetails = await UserModel.findById(userId).select("-password")

      const payload = {
        _id: userDetails?._id,
        name: userDetails?.name,
        email: userDetails?.email,
        profile_pic: userDetails?.profile_pic,
        online: onlineUsers.has(userId)
      }
      socket.emit('message-user', payload)


      //get previous message
      const getConversationMessage = await ConversationModel.findOne({
        "$or": [
          { sender: user?._id, receiver: userId },
          { sender: userId, receiver: user?._id }
        ]
      }).populate('messages').sort({ updatedAt: -1 })

      socket.emit('message', getConversationMessage?.messages || [])
    })

    //new message
    socket.on('new message', async (data) => {

      //check conversation is available both user

      let conversation = await ConversationModel.findOne({
        "$or": [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender }
        ]
      })

      //if conversation is not available
      if (!conversation) {
        const createConversation = await ConversationModel({
          sender: data?.sender,
          receiver: data?.receiver
        })
        conversation = await createConversation.save()
      }

      const message = new MessageModel({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data?.msgByUserId,
      })
      const saveMessage = await message.save()

      const updateConversation = await ConversationModel.updateOne({ _id: conversation?._id }, {
        "$push": { messages: saveMessage?._id }
      })

      const getConversationMessage = await ConversationModel.findOne({
        "$or": [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender }
        ]
      }).populate('messages').sort({ updatedAt: -1 })


      io.to(data?.sender).emit('message', getConversationMessage?.messages || [])
      io.to(data?.receiver).emit('message', getConversationMessage?.messages || [])

      //send conversation
      const conversationSender = await getConversation(data?.sender)
      const conversationReceiver = await getConversation(data?.receiver)

      io.to(data?.sender).emit('conversation', conversationSender)
      io.to(data?.receiver).emit('conversation', conversationReceiver)
    })

    socket.on('sidebar', async (currentUserId) => {
      console.log("current user", currentUserId)

      const conversation = await getConversation(currentUserId)

      socket.emit('conversation', conversation)

    })

    socket.on('seen', async (msgByUserId) => {

      let conversation = await ConversationModel.findOne({
        "$or": [
          { sender: user?._id, receiver: msgByUserId },
          { sender: msgByUserId, receiver: user?._id }
        ]
      })

      const conversationMessageId = conversation?.messages || []

      const updateMessages = await MessageModel.updateMany(
        { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
        { "$set": { seen: true } }
      )

      //send conversation
      const conversationSender = await getConversation(userId)
      const conversationReceiver = await getConversation(msgByUserId)

      io.to(userId).emit('conversation', conversationSender)
      io.to(msgByUserId).emit('conversation', conversationReceiver)
    })


    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("onlineUser", Array.from(onlineUsers.keys()));
      console.log(`❌ User disconnected: ${userId}`);
    });
  } catch (err) {
    console.error("Token error:", err);
    socket.disconnect(true);
  }
});

server.listen(8081, () => {
  console.log("🚀 Server running on http://localhost:8081");
});

export { app, server };
