import api from "./api";

// Get user dashboard data
export const getUserDashboard = async () => {
  try {
    const response = await api.get("/user/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

// Get saved properties
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

// Get user activity
export const getUserActivity = async () => {
  try {
    const response = await api.get("/user/activity");
    return response.data;
  } catch (error) {
    console.error("Error fetching user activity:", error);
    // Return empty array as fallback
    return { activities: [] };
  }
};

// Get recommended properties
export const getRecommendedProperties = async () => {
  try {
    const response = await api.get("/property/recommended");
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended properties:", error);
    // Return empty array as fallback
    return { properties: [] };
  }
};

// Get saved searches
export const getSavedSearches = async () => {
  try {
    const response = await api.get("/user/saved-searches");
    return response.data;
  } catch (error) {
    console.error("Error fetching saved searches:", error);
    // Return empty array as fallback
    return { searches: [] };
  }
};

// Get realtor metrics
export const getRealtorMetrics = async () => {
  try {
    const response = await api.get("/realtor/metrics");
    return response.data;
  } catch (error) {
    console.error("Error fetching realtor metrics:", error);
    // Return default metrics as fallback
    return {
      propertiesSold: 0,
      averageDaysOnMarket: 0,
      clientSatisfaction: "0/5"
    };
  }
};

// Get realtor listing stats
export const getRealtorListingStats = async () => {
  try {
    const response = await api.get("/realtor/listing-stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching realtor listing stats:", error);
    // Return default stats as fallback
    return {
      activeListings: 0,
      pendingSales: 0,
      closedSales: 0
    };
  }
};
