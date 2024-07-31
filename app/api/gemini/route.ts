import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getLocalServices } from "@/lib/getLocationServices";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  const { userMessage, latitude, longitude } = await req.json();

  if (!userMessage || !latitude || !longitude) {
    return new Response(
      JSON.stringify({ error: "----- Missing required fields: userMessage, latitude, or longitude -----" }),
      { status: 400 }
    );
  }

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const writeChunk = async (chunk: { type: string; data: any }) => {
    await writer.write(encoder.encode(JSON.stringify(chunk) + '\n'));
  };

  (async () => {
    try {
      const serviceKeywords = extractServiceKeywords(userMessage);
      let services = [];
      if (serviceKeywords) {
        services = await getLocalServices(serviceKeywords, latitude, longitude);
        await writeChunk({ type: 'services', data: services });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `You are Loca, a local AI service finder. ${
        services.length > 0
          ? `Here are some available services: ${JSON.stringify(services)}. Provide a helpful response based on this information, highlighting the best options.`
          : `Provide a general response about "${userMessage}". If the user is asking about local services, suggest how they might find them.`
      }`;

      const result = await model.generateContentStream(prompt);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        await writeChunk({ type: 'text', data: chunkText });
      }
    } catch (error) {
      console.error(" ---- Server Error:", error);
      await writeChunk({ type: 'error', data: "An error occurred while processing your request." });
    } finally {
      writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function extractServiceKeywords(input: string): string | null {
  const keywords = ["plumber", "nearby", 'downtown', 'near me', "any", "electrician", "mechanic", "restaurant", "dentist"];
  const lowercaseInput = input.toLowerCase();
  
  for (const keyword of keywords) {
    if (lowercaseInput.includes(keyword)) {
      const words = lowercaseInput.split(/\s+/);
      const keywordIndex = words.indexOf(keyword);
      const nearIndex = words.indexOf("near");
      if (nearIndex !== -1 && nearIndex > keywordIndex) {
        return words.slice(keywordIndex, nearIndex + 2).join(" ");
      }
      return `${keyword} near me`;
    }
  }
  
  return null;
}