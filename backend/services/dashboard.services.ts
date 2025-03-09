import UserModel from "../models/user.models";
import PropertyModel from "../models/property.models";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";
import { IProperty } from "../types/property.types";

// Create a mock activity type for now - we'll expand this later
interface UserActivity {
  id: number;
  action: string;
  property: string;
  time: string;
}

// Create a mock saved search type for now
interface SavedSearch {
  id: string;
  name: string;
  criteria: string;
  filters?: Record<string, any>;
}

// Create a mock metrics type for realtors
interface RealtorMetrics {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  pendingListings: number;
  viewsThisMonth: number;
  inquiriesThisMonth: number;
}

// Create a mock listing stats type for realtors
interface ListingStats {
  totalViews: number;
  averageViewsPerListing: number;
  mostViewedListing: {
    id: string;
    title: string;
    views: number;
  };
  averageDaysOnMarket: number;
}

// Get user dashboard data
export const getUserDashboardData = async (userId: string, userRole?: string): Promise<any> => {
  try {
    const user = await UserModel.findById(userId).select('firstName lastName email role savedProperties');
    
    if (!user) {
      throw new AppError("User not found", 404);
    }
    
    // Get basic user data
    const dashboardData = {
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      },
      savedPropertiesCount: user.savedProperties?.length || 0,
    };
    
    return dashboardData;
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    throw new AppError("Failed to get dashboard data", 500);
  }
};

// Get user saved properties
export const getUserSavedProperties = async (userId: string): Promise<IProperty[]> => {
  try {
    const user = await UserModel.findById(userId).populate({
      path: 'savedProperties',
      model: 'Property'
    });
    
    if (!user) {
      throw new AppError("User not found", 404);
    }
    
    return user.savedProperties as unknown as IProperty[] || [];
  } catch (error) {
    console.error("Error getting saved properties:", error);
    throw new AppError("Failed to get saved properties", 500);
  }
};

// Get user activity
export const getUserActivity = async (userId: string): Promise<UserActivity[]> => {
  try {
    // In a real application, we would fetch this from a database
    // For now, we'll return mock data
    const activities: UserActivity[] = [
      {
        id: 1,
        action: "Viewed property",
        property: "Modern Apartment in Downtown",
        time: "2 hours ago"
      },
      {
        id: 2,
        action: "Saved property",
        property: "Luxury Villa with Pool",
        time: "1 day ago"
      },
      {
        id: 3,
        action: "Contacted agent",
        property: "Family Home in Suburbs",
        time: "3 days ago"
      },
      {
        id: 4,
        action: "Scheduled viewing",
        property: "Penthouse with City View",
        time: "1 week ago"
      }
    ];
    
    return activities;
  } catch (error) {
    console.error("Error getting user activity:", error);
    throw new AppError("Failed to get user activity", 500);
  }
};

// Get recommended properties for user
export const getRecommendedPropertiesForUser = async (userId: string): Promise<IProperty[]> => {
  try {
    // In a real application, we would use a recommendation algorithm
    // For now, just return some random properties
    const properties = await PropertyModel.find()
      .limit(4)
      .sort({ createdAt: -1 });
    
    return properties;
  } catch (error) {
    console.error("Error getting recommended properties:", error);
    throw new AppError("Failed to get recommended properties", 500);
  }
};

// Get user saved searches
export const getUserSavedSearches = async (userId: string): Promise<SavedSearch[]> => {
  try {
    // In a real application, we would fetch this from a database
    // For now, we'll return mock data
    const savedSearches: SavedSearch[] = [
      {
        id: "1",
        name: "Downtown Apartments",
        criteria: "Apartments in downtown area",
        filters: {
          type: "apartment",
          location: "downtown",
          minPrice: 200000,
          maxPrice: 500000
        }
      },
      {
        id: "2",
        name: "Family Homes",
        criteria: "3+ bedroom homes in suburbs",
        filters: {
          type: "house",
          location: "suburbs",
          bedrooms: 3,
          minPrice: 300000,
          maxPrice: 700000
        }
      },
      {
        id: "3",
        name: "Investment Properties",
        criteria: "Properties with high ROI potential",
        filters: {
          type: "any",
          investmentPotential: "high",
          maxPrice: 1000000
        }
      }
    ];
    
    return savedSearches;
  } catch (error) {
    console.error("Error getting saved searches:", error);
    throw new AppError("Failed to get saved searches", 500);
  }
};

// Get realtor performance metrics
export const getRealtorMetrics = async (userId: string): Promise<RealtorMetrics> => {
  try {
    // Check if user is a realtor
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new AppError("User not found", 404);
    }
    
    if (user.role !== 'agent' && user.role !== 'seller') {
      throw new AppError("User is not a realtor", 403);
    }
    
    // In a real application, we would fetch this from a database
    // For now, we'll return mock data
    const metrics: RealtorMetrics = {
      totalListings: 24,
      activeListings: 12,
      soldListings: 8,
      pendingListings: 4,
      viewsThisMonth: 1250,
      inquiriesThisMonth: 45
    };
    
    return metrics;
  } catch (error) {
    console.error("Error getting realtor metrics:", error);
    throw new AppError("Failed to get realtor metrics", 500);
  }
};

// Get realtor listing stats
export const getRealtorListingStats = async (userId: string): Promise<ListingStats> => {
  try {
    // Check if user is a realtor
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new AppError("User not found", 404);
    }
    
    if (user.role !== 'agent' && user.role !== 'seller') {
      throw new AppError("User is not a realtor", 403);
    }
    
    // In a real application, we would fetch this from a database
    // For now, we'll return mock data
    const stats: ListingStats = {
      totalViews: 3450,
      averageViewsPerListing: 287,
      mostViewedListing: {
        id: "property123",
        title: "Luxury Penthouse with Ocean View",
        views: 875
      },
      averageDaysOnMarket: 32
    };
    
    return stats;
  } catch (error) {
    console.error("Error getting listing stats:", error);
    throw new AppError("Failed to get listing stats", 500);
  }
};
