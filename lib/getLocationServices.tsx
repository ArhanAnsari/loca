import axios from "axios";
export async function getLocalServices(query: string, latitude: string, longitude: string) {
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
  
      return response.data.results.slice(0, 10).map((place: any) => ({
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