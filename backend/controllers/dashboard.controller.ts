import { Response } from "express";
import { catchAsync, AuthenticatedRequest } from "../utils/handler";
import { 
  getUserDashboardData, 
  getUserSavedProperties, 
  getUserActivity, 
  getRecommendedPropertiesForUser, 
  getUserSavedSearches,
  getRealtorMetrics,
  getRealtorListingStats
} from "../services/dashboard.services";

// Get user dashboard data
export const getDashboard = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;
  const userRole = req.user?.role;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }
  
  const dashboardData = await getUserDashboardData(userId.toString(), userRole);
  
  res.status(200).json({
    success: true,
    data: dashboardData
  });
});

// Get user saved properties
export const getSavedProperties = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }
  
  const savedProperties = await getUserSavedProperties(userId.toString());
  
  res.status(200).json({
    success: true,
    properties: savedProperties
  });
});

// Get user activity
export const getUserActivityData = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }
  
  const activities = await getUserActivity(userId.toString());
  
  res.status(200).json({
    success: true,
    activities: activities
  });
});

// Get recommended properties
export const getRecommendedProperties = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }
  
  const properties = await getRecommendedPropertiesForUser(userId.toString());
  
  res.status(200).json({
    success: true,
    properties: properties
  });
});

// Get saved searches
export const getSavedSearches = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }
  
  const searches = await getUserSavedSearches(userId.toString());
  
  res.status(200).json({
    success: true,
    searches: searches
  });
});

// Get realtor performance metrics
export const getPerformanceMetrics = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }
  
  // Check if user is a realtor/agent
  if (req.user?.role !== 'agent' && req.user?.role !== 'seller') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only realtors can access performance metrics.'
    });
  }
  
  const metrics = await getRealtorMetrics(userId.toString());
  
  res.status(200).json({
    success: true,
    metrics: metrics
  });
});

// Get realtor listing stats
export const getListingStats = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }
  
  // Check if user is a realtor/agent
  if (req.user?.role !== 'agent' && req.user?.role !== 'seller') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only realtors can access listing stats.'
    });
  }
  
  const stats = await getRealtorListingStats(userId.toString());
  
  res.status(200).json({
    success: true,
    stats: stats
  });
});
