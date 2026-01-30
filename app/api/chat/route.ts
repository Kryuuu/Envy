import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { text: "Maaf, sistem AI sedang offline (API Key belum dikonfigurasi). Silakan hubungi via WhatsApp." },
        { status: 200 } // Return 200 to display the error message as a chat reply
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "You are Nvy AI, a helpful virtual assistant for Envy's portfolio website. You function as customer support. Your goal is to answer questions about Envy's services (Programmer, Video Editor, Photographer, Videographer, Graphic Designer, Content Creator) professionally and concisely. Always reply in Indonesian unless asked in English." }]
            },
            {
                role: "model",
                parts: [{ text: "Halo! Saya Nvy AI. Saya siap membantu Anda menjawab pertanyaan seputar layanan jasa Envy. Apa yang ingin Anda tanyakan?" }]
            }
        ]
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini API Error FULL:", error);
    
    // Check for quota exceeded or rate limit errors
    const errorMessage = error.body || error.message || JSON.stringify(error);
    if (
      errorMessage.includes("429") || 
      errorMessage.includes("Quota exceeded") || 
      errorMessage.includes("RESOURCE_EXHAUSTED")
    ) {
      return NextResponse.json(
        { text: "limit_reached" }, // Special signal for frontend
        { status: 429 }
      );
    }

    return NextResponse.json(
      { text: `Maaf, ada gangguan teknis. Error: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
