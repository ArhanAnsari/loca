import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getLocalServices } from "@/lib/getLocationServices";

import { faqs } from "@/app/faq/data";
import { adminAuth, admindb } from "@/lib/firebaseAdmin";
import { extractServiceKeywords } from "@/lib/extractServiceKeywords";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "No session cookie found" }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userDoc = await admindb.collection("users").doc(decodedClaims.uid).get();
    const userData = userDoc.data();
    const userName = userData?.name || "User";

    const { userMessage, latitude, longitude, conversationHistory } = await req.json();

    if (!userMessage) {
      return new Response(JSON.stringify({ error: "Missing required field: userMessage" }), { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const writeChunk = async (chunk: { type: string; data: any }) => {
      await writer.write(encoder.encode(JSON.stringify(chunk) + "\n"));
    };

    (async () => {
      try {
        const serviceKeywords = extractServiceKeywords(userMessage);
        let services = [];
        if (serviceKeywords) {
          services = await getLocalServices(serviceKeywords, latitude, longitude);
          await writeChunk({ type: "services", data: services });
        }
    
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
        // Construct the conversation history
        let conversationContext = conversationHistory ? conversationHistory.join("\n") : "";
        conversationContext += `\nUser: ${userMessage}\n`;
    
        const prompt = `You are Loca, a local AI service finder. You're talking to ${userName}. 
        Here is some important information about you (Loca) in the form of FAQs:
        ${JSON.stringify(faqs)}
        
        Previous conversation:
        ${conversationContext}
        
        ${services.length > 0 
          ? `Here are some available services related to "${serviceKeywords}": ${JSON.stringify(services)}. Provide a helpful response based on this information, highlighting the best options for ${userName}.`
          : serviceKeywords
            ? `The user asked about "${serviceKeywords}", but I couldn't find any services. Please provide general information or suggestions about this type of service. and let them know mispelled may occur for not showing services if keyword doesn't match the keyword in out keyword database only say this if you think ${userName} is looking for specific service provider`
            : `Provide a response about "${userMessage}" for ${userName}, keeping in mind the conversation context. If they are asking about local services and you don't have location data, suggest how they might find them tell them to make sure they're location is turn on in settings of their phone or laptop and tell thwm you can only provide services provider near them because that's your unique  and let them know mispelled may occur for not showing services if keyword doesn't match the keyword in out keyword database only say this if you think ${userName} is looking for specific service provider.`
        }
        
        Remember the context of the conversation and respond appropriately to follow-up questions or comments.`;

        const result = await model.generateContentStream(prompt);

        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          await writeChunk({ type: "text", data: chunkText });
        }

        if (services.length > 0) {
          await writeChunk({ type: "services", data: services });
        }
      } catch (error) {
        console.error(" ---- Server Error:", error);
        await writeChunk({
          type: "error",
          data: "An error occurred while processing your request.",
        });
      } finally {
        writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error verifying token or fetching user data:", error);
    return new Response(JSON.stringify({ error: "Invalid token or user data not found" }), { status: 403 });
  }
}

// Function to extract service keywords from the input string


