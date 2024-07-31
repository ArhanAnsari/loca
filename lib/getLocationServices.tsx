import axios from "axios";

export async function getLocalServices(query: string, latitude: string, longitude: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.error("Google Places API key is not set");
    throw new Error("Google Places API key is not configured");
  }

  console.log(`Fetching services for query: ${query}, lat: ${latitude}, lng: ${longitude}`);

  const searchTerms = [query, "home repair", "handyman"];

  for (const term of searchTerms) {
    try {
      const url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
      const params = {
        location: `${latitude},${longitude}`,
        radius: 10000,  // 10km radius
        type: "business",
        keyword: term,
        key: apiKey,
      };

      console.log(`Making API request for term "${term}" with params:`, JSON.stringify({...params, key: "API_KEY_MASKED"}));

      const response = await axios.get(url, { params, timeout: 8000 });

      console.log("API Response status:", response.status);
      console.log("API Response data:", JSON.stringify(response.data));

      if (response.data.status === "REQUEST_DENIED") {
        console.error("Google Places API request denied:", response.data.error_message);
        throw new Error(`Google Places API request denied: ${response.data.error_message}`);
      }

      if (response.data.results.length > 0) {
        const places = response.data.results.slice(0, 10);
        console.log(`Found ${places.length} places for term "${term}"`);

        const detailedPlaces = await Promise.all(places.map(async (place: any) => {
          const detailsUrl = "https://maps.googleapis.com/maps/api/place/details/json";
          const detailsParams = {
            place_id: place.place_id,
            fields: "website,formatted_phone_number,formatted_address",
            key: apiKey,
          };

          const detailsResponse = await axios.get(detailsUrl, { params: detailsParams, timeout: 8000 });
          const details = detailsResponse.data.result;

          return {
            name: place.name,
            address: details.formatted_address || place.vicinity,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            place_id: place.place_id,
            // phone_number: details.formatted_phone_number || "Not available",
            // website: details.website && details.formatted_website || "Not available",
            search_term: term
          };
        }));

        return detailedPlaces;
      }
    } catch (error) {
      console.error(`Error fetching services for term "${term}":`, error);
    }
  }

  console.log("No results found for any search terms");
  return [];
}