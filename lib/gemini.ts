import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.GEMINI_API_KEY;
const foursquareApiKey = process.env.FOURSQUARE_API_KEY;

const genAI = new GoogleGenerativeAI(geminiApiKey as string);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  systemInstruction: 'I\'m Loca, your friendly virtual assistant for finding local services!',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

export async function POST(req: NextRequest) {
  const { userMessage, latitude, longitude } = await req.json();

  if (!userMessage || !latitude || !longitude) {
    return NextResponse.json({ error: 'Missing required fields: userMessage, latitude, or longitude' }, { status: 400 });
  }

  try {
    // Gemini API request
    const chatSession = model.startChat({ generationConfig });

    const result = await chatSession.sendMessage(userMessage);
    const geminiResponse = result.response.text();

    // Debugging: Log the API keys and request parameters
    console.log('Gemini API Key:', geminiApiKey);
    console.log('Foursquare API Key:', foursquareApiKey);
    console.log('User Message:', userMessage);
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);

    // Foursquare API request
    const foursquareResponse = await axios.get(`https://api.foursquare.com/v3/places/search`, {
      params: {
        query: userMessage,
        ll: `${latitude},${longitude}`,
        limit: 5,
      },
      headers: {
        Authorization: `Bearer ${foursquareApiKey}`, // Ensure Bearer token is correctly formatted
      },
      timeout: 10000
    });

    const places = foursquareResponse.data.results.map((place: any) => ({
      name: place.name,
      address: place.location.address,
      contact: place.contact?.phone || 'N/A',
    }));

    const finalResponse = {
      geminiResponse,
      places
    };

    return NextResponse.json(finalResponse, { status: 200 });

  } catch (error: any) {
    console.error('Server Error:', error.response?.data || error.message);
    let errorMessage = 'An unexpected error occurred';
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please check your API keys.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'The request timed out. Please try again.';
      } else if (error.response) {
        errorMessage = `Server responded with error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response received from the server';
      }
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
