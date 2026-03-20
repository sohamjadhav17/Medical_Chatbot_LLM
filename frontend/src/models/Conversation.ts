import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  userId: string;
  title: string;
  createdAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
  userId: { type: String, required: true },
  title: { type: String, default: "New Conversation" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema);
