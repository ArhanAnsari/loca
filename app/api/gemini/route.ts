import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Function to get local services from Google Places API (unchanged)
async function getLocalServices(query: string, latitude: string, longitude: string) {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
    if (!apiKey) {
      console.error("Google Places API key is not set");
      throw new Error("Google Places API key is not configured");
    }
  
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        {
          params: {
            location: `${latitude},${longitude}`,
            radius: 5000, // Search within 5km radius
            type: "business", // This can be adjusted based on the specific types you're interested in
            keyword: query,
            key: apiKey,
          },
          timeout: 8000, // Reduced timeout for faster failure
        }
      );
  
      if (response.data.status === "REQUEST_DENIED") {
        console.error(
          "Google Places API request denied:",
          response.data.error_message
        );
        throw new Error(
          `Google Places API request denied: ${response.data.error_message}`
        );
      }
  
      return response.data.results.slice(0, 5).map((place: any) => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        place_id: place.place_id,
      }));
    } catch (error) {
      console.error("Google Places API Error:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `Google Places API Error: ${error.response.status} - ${error.response.data.error_message}`
        );
      } else {
        throw new Error("Failed to fetch local services");
      }
    }
  }

export async function POST(req: NextRequest) {
  const { userMessage, latitude, longitude } = await req.json();

  if (!userMessage || !latitude || !longitude) {
    return NextResponse.json(
      { error: "Missing required fields: userMessage, latitude, or longitude" },
      { status: 400 }
    );
  }

  try {
    console.log("Fetching local services");
    let services;
    try {
      services = await getLocalServices(userMessage, latitude, longitude);
      console.log("Received local services");
    } catch (error) {
      console.error("Error fetching local services:", error);
      services = [];
    }

    console.log("Sending message to Gemini");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const contextMessage = `You are to act as a local AI service finder built by devben. User is looking for local services: "${userMessage}". ${
      services.length > 0
        ? `Here are some available services: ${JSON.stringify(
            services
          )}. Please provide a helpful response based on this information, highlighting and bold the best options based on ratings and number of reviews. If "${userMessage}" doesn't sound like they are looking for local service respond casually for example text like "hello what can you do" you knew you had to reply casually`
        : `Unfortunately, we couldn't find any local services matching the query. Please provide a general response about ${userMessage} and suggest how the user might find local services.`
    }`;

    const result = await model.generateContent(contextMessage);
    const response = await result.response;
    const vertexResponseText = response.text();
    console.log("Received response from Gemini");

    return NextResponse.json(
      {
        vertexResponse: vertexResponseText,
        services,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Server Error:", JSON.stringify(error, null, 2), error);
    let errorMessage = `Something went wrong on the server ${error.message}`;
    let statusCode = 500;
    if (error.message.includes("Google Places API Error")) {
      errorMessage = `Error fetching local services. Please try again later. ${error.message}`;
      statusCode = 503; // Service Unavailable
    } else if (error.message.includes("Gemini API")) {
      errorMessage = `Error communicating with AI service. Please check the configuration and try again later. ${error.message}`;
      statusCode = 503;
    }
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}