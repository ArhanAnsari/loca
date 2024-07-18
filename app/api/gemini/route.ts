import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google-cloud/vertexai";

// Function to initialize Vertex AI with JSON credentials
function initializeVertexAI() {
  const credentialsJson = `
  {
  "type": "service_account",
  "project_id": "loca-bc18e",
  "private_key_id": "db79930f64681d1840c4aee406c1ada61a8d28c6",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCceQYvnPE5jUBz\n45ERr275LpEkuYCt+797SRrp0Q8pu3fxcLhnMv+YYviukETfskYAuH+lllXfvbUa\nFqXmk3PMz4qxReDloXLEbivuuWRYW5YRwfJb5qCLIYS4/xQ8xNF+1dReDDTe0L+9\nQFtGH0hO0JbgWvqjmGLwie/ZENqdjIO56i7okaRmTFtjrc5Ee4R59Oplqimc7iVR\nyB2wFEafX7N3KEtJ9RlnJxZn/7v69iUk1/cS/PzJVbqzLelKjBaOLhQ1WlHLfycd\n7qSxSfWbEFGenkhW0wvruz6XpYyeSMQTufiu+qgeb1UURg2pgKacEb6WdpFuUcFl\n50qiwantAgMBAAECggEACISABTR+Xxsk0IopOfS6Tj8uMHkWm6HyHPRwTh0Ovb9S\nOqbfquJ4TmPI1LvOu/yY2e4xKKLj3s+VXauw8TnCmnoLuzWqFeXxeObkZlTaNQMb\nSrErj7wgriIvduCPyfUO0GA0dMAmWqCzZ0prDYijZ4LsS584OJKRhDWGBGNp+xx2\nr1+y9RuQLQy0sJrf7jvxJ6UU+qd/rdTw9l3evP+TMIdLhTHgkP512SGOG2GCq6uE\nkWghj7zBK/Obi3dqjkQxhwN5KNJEkQUMtGSieOrZH3JbPgzS4Yq5nxeDYSHavqYC\ndreaaMuETG9y0ZZSdlTy49nRAyrUibAIuSIJz51E8QKBgQDXtMg23ttJNVg+UveW\nkLFZSWbDsjhGKyAbZjGAK5LIBYD3TiuBLbPyPGqm3VjoIYErEK65ck9QeAcPuxQC\n/TL+1LnFfrrBl6rrFpVBsqlSsU5yimaq0i1/sxTb4yjOcTnr8doKivdWvNcTzO5F\nnbqTOfpmkKSGtQifiiiOQB6kxQKBgQC5s6ii+0mMoAJN+4nL1z9uRy2gYxzCKRq6\nWnfJjRgswKgoqQxzODPjkD776Bv4Zc3MH2CIhH2Hhr9mwchO4K/mYBQaKikPu7ts\n+O/pJOx7kWxtx0BEZzfH3bjCBr37BwHra1CwuOsFUfgtr5k41wmMkACIyLqiPdG7\nVriawVpTCQKBgQChg4wnCdfIiVj50cXxx4YEBSIdhmT8pW31FiAaiIXvn69hffa1\nUzNaPkLdjv/zUKMXS/aIhT8+UaF39eyWEGEOztoLN0k/jAE+5jn8Z3rBoGHNAjS9\n04KeC8minAUCD2X/dah+HG/3Uo75FImVNvVtKAyGn+eRthwu2ZRkbz6CwQKBgAzG\nCueLGXgO2Zm7n7Lhz38qbj0GFEhWw3vmFS9MAUmyxt5lInIaf5c7qNlzEdl4Rzuv\nPNinJGtaHXhYBAtI8VCLc1aJZ+GpLC9GwFntLEcjra2vcwBBiVi6K6dNB2xpAvzK\nmPZPAfuPs96QoZ2DTSjaDu9Zv1zBm9ejE3exrSDhAoGBAKpZN13iTLva/VIugPJg\n6O441S7Av8AX/wQA+zIuwrdOlablmuauoraYV2sug+2b0tEHoptkedAH5mCZhPOi\n0b8n+/uDX0eux1A2ECCfPxl/qy1OhkT06m3VZlKaMuSOAYnqn3RGcBIR41pEnyDJ\n4teyxfYdHo2KQ4Z7Klx+q86J\n-----END PRIVATE KEY-----\n",
  "client_email": "loca-614@loca-bc18e.iam.gserviceaccount.com",
  "client_id": "115115263008370714449",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/loca-614%40loca-bc18e.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

  `;

  if (!credentialsJson) {
    throw new Error(
      "GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set"
    );
  }

  try {
    const credentials = JSON.parse(credentialsJson);
    return new VertexAI({
      project: credentials.project_id,
      location: "us-central1",
      googleAuthOptions: credentials,
    });
  } catch (error) {
    console.error("Error parsing GOOGLE_APPLICATION_CREDENTIALS_JSON:", error);
    throw new Error("Invalid GOOGLE_APPLICATION_CREDENTIALS_JSON");
  }
}

// Function to get local services from Google Places API
async function getLocalServices(
  query: string,
  latitude: string,
  longitude: string
) {
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
    const vertexAI = initializeVertexAI();
    const model = vertexAI.getGenerativeModel({ model: "gemini-1.5-pro-001" });
    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
        topP: 1,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    console.log("Fetching local services");
    let services;
    try {
      services = await getLocalServices(userMessage, latitude, longitude);
      console.log("Received local services");
    } catch (error) {
      console.error("Error fetching local services:", error);
      services = [];
    }

    console.log("Sending message to Vertex AI");
    const contextMessage = `You are to act as a loca an AI local service finder build by devben. User is looking for local services: "${userMessage}". ${
      services.length > 0
        ? `Here are some available services: ${JSON.stringify(
            services
          )}. Please provide a helpful response based on this information, highlighting and bold the best options based on ratings and number of reviews. If "${userMessage}" doesn't sound like they are looking for local service respond casually for example text like "hello what can you do" you knew you had to reply casually`
        : `Unfortunately, we couldn't find any local services matching the query. Please provide a general response about ${userMessage} and suggest how the user might find local services.`
    }`;

    const result = await chat.sendMessage(contextMessage);
    console.log("Received response from Vertex AI");

    const vertexResponseText =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Vertex AI";

    return NextResponse.json(
      {
        vertexResponse: vertexResponseText,
        services,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Server Error:", error.message);
    let errorMessage = `Something went wrong on the server ${error.message}`;
    let statusCode = 500;
    if (error.message.includes("Google Places API Error")) {
      errorMessage = `Error fetching local services. Please try again later. ${error.message}`;
      statusCode = 503; // Service Unavailable
    } else if (
      error.message.includes("Vertex AI") ||
      error.message.includes("GOOGLE_APPLICATION_CREDENTIALS_JSON")
    ) {
      errorMessage = `Error communicating with AI service. Please check the configuration and try again later.${error.message}`;
      statusCode = 503;
    }
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
