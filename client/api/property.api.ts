import api from "./api";

export const getPropertyById = async (id: string) => {
  if (!id) {
    throw new Error("Property ID is required");
  }
  try {
    const response = await api.get(`/property/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching property:", error);
    throw error;
  }
};

interface PropertyData {
  title: string;
  description: string;
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    yearBuilt?: number;
  };
  [key: string]: any; // For any additional properties
}

export const createProperty = async (propertyData: PropertyData) => {
  if (!propertyData) {
    throw new Error("Property data is required");
  }
  try {
    const response = await api.post("/property/create", propertyData);

    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const getPropertyListings = async () => {
  try {
    const response = await api.get("/property");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching property list:", error);
    throw error;
  }
};

export const getPropertyByUserId = async () => {
  try {
    const response = await api.get("/property/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching property list:", error);
    throw error;
  }
};

export const getProperties = async () => {
  try {
    // Add timestamp to prevent caching (304 responses)
    const timestamp = new Date().getTime();
    const response = await api.get(`/property/all?t=${timestamp}`);
    return response.data.properties || response.data; // Handle both formats
  } catch (error) {
    console.error("Error fetching property list:", error);
    throw error;
  }
};

export const getSavedProperties = async () => {
  try {
    const response = await api.get("/user/saved-properties");
    return response.data;
  } catch (error) {
    console.error("Error fetching saved properties:", error);
    // Return empty array as fallback
    return { properties: [] };
  }
};
