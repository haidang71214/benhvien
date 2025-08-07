import mongoose, { Schema, Types } from "mongoose";

// này t tạo 2 cái, 1 là phòng chat, 2 là thao tác với message
const messageSchema = new Schema({
   conversation:{
      type:Types.ObjectId,
      ref:"Conversation"
   },
   content:String,
   // ai gửi ?
   sender: Types.ObjectId,
   readBy:{
     type: [Types.ObjectId],
     ref:'User'
   }
})
// cái cục conversation sẽ lưu id của mấy thằng nhắn tin với nhau đó 
const conversationSchema = new Schema({
   participants:{
      type:[Types.ObjectId],
      ref:'User'
   }
})
const conversations = mongoose.model('conversations',conversationSchema)
const messages = mongoose.model('messages',messageSchema);
export  {messages,conversations}