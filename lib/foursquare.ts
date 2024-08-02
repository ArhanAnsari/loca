import axios from "axios";

const foursquareApiKey = process.env.FOURSQUARE_API_KEY;

export const fetchFoursquareData = async (query: string, location: string) => {
  const url = `https://api.foursquare.com/v3/places/search?query=${query}&near=${location}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: foursquareApiKey,
      },
    });

    return response.data.results;
  } catch (error) {
    console.error("Error fetching data from Foursquare:", error);
    throw new Error("Failed to fetch data from Foursquare");
  }
};
