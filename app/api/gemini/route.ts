import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getLocalServices } from "@/lib/getLocationServices";
import { keyword } from "@/lib/keywords";
import { faqs } from "@/app/faq/data";
import { adminAuth, admindb } from "@/lib/firebaseAdmin";

// Initialize the Google Generative AI with the provided API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    // Get the authorization token from the request headers
     // Get the session cookie from the request
     const sessionCookie = req.cookies.get('session')?.value;

     if (!sessionCookie) {
       return NextResponse.json({ error: "No session cookie found" }, { status: 401 });
     }
 
     // Verify the session cookie
     const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
 
     // Fetch user data from Firestore
     const userDoc = await admindb.collection("users").doc(decodedClaims.uid).get();
     const userData = userDoc.data();
     const userName = userData?.name || "User";

  

    // Parse the request body to get userMessage, latitude, and longitude
    const { userMessage, latitude, longitude } = await req.json();

    // Validate the required fields
    if (!userMessage || !latitude || !longitude) {
      return new Response(
        JSON.stringify({
          error:
            "----- Missing required fields: userMessage, latitude, or longitude -----",
        }),
        { status: 400 },
      );
    }

    // Initialize the encoder and stream for sending responses
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Function to write chunks of data to the stream
    const writeChunk = async (chunk: { type: string; data: any }) => {
      await writer.write(encoder.encode(JSON.stringify(chunk) + "\n"));
    };

    // Asynchronous function to handle the main logic
    (async () => {
      try {
        // Extract service keywords from the user message
        const serviceKeywords = extractServiceKeywords(userMessage);
        let services = [];
        if (serviceKeywords) {
          // Fetch local services based on the extracted keywords and location
          services = await getLocalServices(
            serviceKeywords,
            latitude,
            longitude,
          );
          await writeChunk({ type: "services", data: services });
        }

        // Get the generative model from Google Generative AI
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Modify the prompt to include the user's name
        const prompt = `You are Loca, a local AI service finder. You're talking to ${userName}.Here is some important information about you (Loca) in the form of FAQs:
       ${JSON.stringify(faqs)} ${
          services.length > 0
            ? `Here are some available services: ${JSON.stringify(services)}. Provide a helpful response based on this information, highlighting the best options for ${userName}.`
            : `Provide a general response about "${userMessage}" for ${userName}. If they are asking about local services, suggest how they might find them using your ${faqs} aor just let them know to turn on their location, tell them to give you access to thier location cause you will need that to get them services near them.`
        }`;

        // Generate content stream from the AI model based on the prompt
        const result = await model.generateContentStream(prompt);

        // Write the generated content to the stream
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          await writeChunk({ type: "text", data: chunkText });
        }

        // Send services again at the end to ensure they're not missed
        if (services.length > 0) {
          await writeChunk({ type: "services", data: services });
        }
      } catch (error) {
        // Handle errors and write an error message to the stream
        console.error(" ---- Server Error:", error);
        await writeChunk({
          type: "error",
          data: "An error occurred while processing your request.",
        });
      } finally {
        // Close the writer
        writer.close();
      }
    })();

    // Return the readable stream as the response
    return new Response(stream.readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Error verifying token or fetching user data:", error);
    return new Response(
      JSON.stringify({ error: "Invalid token or user data not found" }),
      { status: 403 },
    );
  }
}

// Function to extract service keywords from the input string
function extractServiceKeywords(input: string): string | null {
  // Import keywords from @lib/keywords
  const keywords = keyword;
  const lowercaseInput = input.toLowerCase();

  // Check if the input contains any of the keywords
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
