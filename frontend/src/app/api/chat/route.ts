import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { message, conversation_id } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const userId = (session.user as any).id || "unknown";
    const userEmail = session.user.email || "unknown@system.local";

    // Connect to MongoDB
    await connectToDatabase();

    // 2. Find or create conversation
    let currentConversation;
    if (conversation_id) {
      currentConversation = await Conversation.findOne({ _id: conversation_id, userId });
    }

    if (!currentConversation) {
      currentConversation = await Conversation.create({
        userId,
        title: message.substring(0, 40) + (message.length > 40 ? "..." : "")
      });
    }

    // 3. Save User Message
    await Message.create({
      conversationId: currentConversation._id,
      role: "user",
      content: message
    });

    const secret = process.env.NEXTAUTH_SECRET || "default_secret_for_development_change_me";
    
    // Create token mirroring PyJWT payload structure expectation for Flask
    const token = jwt.sign(
      { 
        id: userId, 
        email: userEmail 
      }, 
      secret,
      { algorithm: "HS256", expiresIn: "1h" }
    );

    const flaskUrl = process.env.RAG_BACKEND_URL || process.env.NEXT_PUBLIC_FLASK_API_URL || "http://127.0.0.1:8080";

    const response = await fetch(`${flaskUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      // Pass the MongoDB conversation_id so Flask knows the context if it needs to track anything internal, 
      // but primary history is in MongoDB.
      body: JSON.stringify({ message, conversation_id: currentConversation._id.toString() })
    });

    if (!response.ok) {
        let errorText = await response.text();
        try {
            const errJson = JSON.parse(errorText);
            return NextResponse.json(errJson, { status: response.status });
        } catch {
            return NextResponse.json({ error: errorText || "Unknown Backend Error" }, { status: response.status });
        }
    }

    const data = await response.json();
    
    // 5. Save Assistant Message
    await Message.create({
      conversationId: currentConversation._id,
      role: "assistant",
      content: data.answer || "No response generated."
    });

    // 6. Return response to frontend
    return NextResponse.json({ 
      ...data,
      conversation_id: currentConversation._id.toString()
    });
    
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message || "Failed to process chat." }, { status: 500 });
  }
}
