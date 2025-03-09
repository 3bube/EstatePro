import User from "../models/user.models";
import Property from "../models/property.models";
import { Types } from "mongoose";
import { AppError } from "../utils/AppError";

// Types for query parameters
interface QueryParams {
  page: number;
  limit: number;
  status?: string;
  role?: string;
  type?: string;
  search?: string;
  dateRange?: string;
  reportType?: string;
}

// Get dashboard statistics for admin
export const getDashboardStats = async () => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get active users (users who logged in within the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo },
    });

    // Get total properties
    const totalProperties = await Property.countDocuments();

    // Get properties by status
    const propertiesByStatus = await Property.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get new users in the last 30 days
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get new properties in the last 30 days
    const newProperties = await Property.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get recent user activity
    const recentActivity = await User.find({
      lastLogin: { $gte: thirtyDaysAgo },
    })
      .sort({ lastLogin: -1 })
      .limit(10)
      .select("firstName lastName email role lastLogin");

    // Mock data for transactions (replace with actual transaction data when available)
    const transactionStats = {
      totalTransactions: 156,
      pendingTransactions: 23,
      completedTransactions: 133,
      totalValue: 4567890,
      averageValue: 29281,
    };

    // Mock data for monthly stats (replace with actual data when available)
    const monthlyStats = {
      users: [120, 132, 145, 162, 178, 195, 210, 228, 240, 252, 270, 285],
      properties: [45, 52, 58, 63, 72, 85, 92, 103, 110, 118, 125, 134],
      transactions: [12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48],
    };

    return {
      totalUsers,
      activeUsers,
      usersByRole,
      totalProperties,
      propertiesByStatus,
      newUsers,
      newProperties,
      recentActivity,
      transactionStats,
      monthlyStats,
    };
  } catch (error) {
    console.error("Error getting admin dashboard stats:", error);
    throw new AppError("Failed to get admin dashboard statistics", 500);
  }
};

// Get users list for admin
export const getUsersList = async ({
  page = 1,
  limit = 10,
  status,
  role,
  search,
}: QueryParams) => {
  try {
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (status) {
      query.isVerified = status === "active" ? true : false;
    }

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Get users
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password");

    // Get total count for pagination
    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error getting users list:", error);
    throw new AppError("Failed to get users list", 500);
  }
};

// Get user details by ID
export const getUserDetails = async (userId: string) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID", 400);
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate("savedProperties");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Get user's properties
    const properties = await Property.find({ owner: userId });

    // Mock data for user activity (replace with actual data when available)
    const userActivity = [
      { action: "Logged in", timestamp: new Date(Date.now() - 86400000) },
      {
        action: "Updated profile",
        timestamp: new Date(Date.now() - 172800000),
      },
      {
        action: "Saved a property",
        timestamp: new Date(Date.now() - 259200000),
      },
      { action: "Sent a message", timestamp: new Date(Date.now() - 345600000) },
    ];

    return {
      user,
      properties,
      activity: userActivity,
    };
  } catch (error) {
    console.error("Error getting user details:", error);
    throw error;
  }
};

// Update user status
export const updateUserStatus = async (userId: string, status: string) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID", 400);
    }

    const isActive = status === "active";
    const isSuspended = status === "suspended";

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isVerified: isActive,
        isSuspended: isSuspended,
      },
      { new: true }
    ).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// Update user role
export const updateUserRole = async (userId: string, role: string) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID", 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

// Get property list for admin
export const getPropertyList = async ({
  page = 1,
  limit = 10,
  status,
  type,
  search,
}: QueryParams) => {
  try {
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (type) {
      query.propertyType = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
        { "address.state": { $regex: search, $options: "i" } },
      ];
    }

    // Get properties
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner", "firstName lastName email");

    // Get total count for pagination
    const total = await Property.countDocuments(query);

    return {
      properties,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error getting property list:", error);
    throw new AppError("Failed to get property list", 500);
  }
};

// Get transactions list for admin (mock data for now)
export const getTransactionsList = async ({
  page = 1,
  limit = 10,
  status,
  dateRange,
}: QueryParams) => {
  try {
    // Mock data for transactions
    const transactions = [
      {
        id: "t1",
        propertyId: "p1",
        propertyTitle: "Luxury Apartment in Downtown",
        buyerId: "u1",
        buyerName: "John Doe",
        sellerId: "u2",
        sellerName: "Jane Smith",
        amount: 450000,
        status: "completed",
        date: new Date(Date.now() - 86400000),
        commission: 13500,
      },
      {
        id: "t2",
        propertyId: "p2",
        propertyTitle: "Suburban Family Home",
        buyerId: "u3",
        buyerName: "Bob Johnson",
        sellerId: "u4",
        sellerName: "Alice Williams",
        amount: 325000,
        status: "pending",
        date: new Date(Date.now() - 172800000),
        commission: 9750,
      },
      {
        id: "t3",
        propertyId: "p3",
        propertyTitle: "Beach House with Ocean View",
        buyerId: "u5",
        buyerName: "Charlie Brown",
        sellerId: "u6",
        sellerName: "Diana Miller",
        amount: 780000,
        status: "completed",
        date: new Date(Date.now() - 259200000),
        commission: 23400,
      },
      {
        id: "t4",
        propertyId: "p4",
        propertyTitle: "Mountain Cabin Retreat",
        buyerId: "u7",
        buyerName: "Edward Davis",
        sellerId: "u8",
        sellerName: "Fiona Clark",
        amount: 295000,
        status: "pending",
        date: new Date(Date.now() - 345600000),
        commission: 8850,
      },
      {
        id: "t5",
        propertyId: "p5",
        propertyTitle: "Modern Condo with City View",
        buyerId: "u9",
        buyerName: "George Wilson",
        sellerId: "u10",
        sellerName: "Hannah Moore",
        amount: 520000,
        status: "completed",
        date: new Date(Date.now() - 432000000),
        commission: 15600,
      },
    ];

    // Filter by status if provided
    let filteredTransactions = transactions;
    if (status) {
      filteredTransactions = transactions.filter((t) => t.status === status);
    }

    // Filter by date range if provided
    if (dateRange) {
      // Parse date range (format: "YYYY-MM-DD,YYYY-MM-DD")
      const [startDateStr, endDateStr] = dateRange.split(",");
      if (startDateStr && endDateStr) {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999); // End of the day

        filteredTransactions = filteredTransactions.filter(
          (t) => t.date >= startDate && t.date <= endDate
        );
      }
    }

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedTransactions = filteredTransactions.slice(
      skip,
      skip + limit
    );

    return {
      transactions: paginatedTransactions,
      pagination: {
        total: filteredTransactions.length,
        page,
        limit,
        pages: Math.ceil(filteredTransactions.length / limit),
      },
    };
  } catch (error) {
    console.error("Error getting transactions list:", error);
    throw new AppError("Failed to get transactions list", 500);
  }
};

// Get reports for admin (mock data for now)
export const getReports = async (
  reportType,
  dateRange
): Promise<QueryParams> => {
  try {
    // Define report data based on report type
    let reportData;

    switch (reportType) {
      case "user_growth":
        reportData = {
          title: "User Growth Report",
          description: "Monthly user registration statistics",
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "New Users",
              data: [45, 52, 60, 65, 72, 78, 85, 92, 98, 105, 112, 120],
            },
            {
              label: "Active Users",
              data: [
                120, 132, 145, 162, 178, 195, 210, 228, 240, 252, 270, 285,
              ],
            },
          ],
        };
        break;

      case "property_listings":
        reportData = {
          title: "Property Listings Report",
          description: "Monthly property listing statistics",
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "New Listings",
              data: [25, 28, 32, 35, 40, 45, 48, 52, 55, 58, 62, 65],
            },
            {
              label: "Sold Properties",
              data: [12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48],
            },
          ],
        };
        break;

      case "transactions":
        reportData = {
          title: "Transaction Report",
          description: "Monthly transaction statistics",
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Transaction Volume",
              data: [12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48],
            },
            {
              label: "Revenue (in $10,000)",
              data: [45, 52, 60, 72, 85, 95, 110, 125, 140, 155, 170, 185],
            },
          ],
        };
        break;

      case "user_activity":
        reportData = {
          title: "User Activity Report",
          description: "User engagement statistics",
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Property Views",
              data: [
                1200, 1350, 1500, 1650, 1800, 1950, 2100, 2250, 2400, 2550,
                2700, 2850,
              ],
            },
            {
              label: "Saved Properties",
              data: [
                350, 380, 410, 440, 470, 500, 530, 560, 590, 620, 650, 680,
              ],
            },
            {
              label: "Messages Sent",
              data: [
                180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510,
              ],
            },
          ],
        };
        break;

      default:
        reportData = {
          title: "General Statistics",
          description: "Overview of platform statistics",
          summary: {
            totalUsers: 285,
            totalProperties: 134,
            totalTransactions: 48,
            totalRevenue: 1850000,
          },
          topPerformers: {
            agents: [
              { name: "John Smith", transactions: 12, revenue: 450000 },
              { name: "Jane Doe", transactions: 10, revenue: 380000 },
              { name: "Bob Johnson", transactions: 8, revenue: 320000 },
            ],
            properties: [
              { title: "Luxury Apartment", views: 1250, saves: 85 },
              { title: "Suburban Home", views: 980, saves: 72 },
              { title: "Beach House", views: 850, saves: 65 },
            ],
          },
        };
    }

    return reportData;
  } catch (error) {
    console.error("Error getting reports:", error);
    throw new AppError("Failed to get reports", 500);
  }
};

// Get roles and permissions (mock data for now)
export const getAdminRoles = async () => {
  try {
    // Mock data for roles and permissions
    const roles = [
      {
        id: "role1",
        name: "Admin",
        description: "Full access to all features",
        permissions: [
          { id: "perm1", name: "User Management", description: "Manage users" },
          {
            id: "perm2",
            name: "Property Management",
            description: "Manage properties",
          },
          {
            id: "perm3",
            name: "Transaction Management",
            description: "Manage transactions",
          },
          {
            id: "perm4",
            name: "Report Access",
            description: "Access all reports",
          },
          {
            id: "perm5",
            name: "Role Management",
            description: "Manage roles and permissions",
          },
        ],
      },
      {
        id: "role2",
        name: "Agent",
        description: "Access to agent features",
        permissions: [
          {
            id: "perm6",
            name: "Property Listing",
            description: "Create and manage property listings",
          },
          {
            id: "perm7",
            name: "Client Management",
            description: "Manage clients",
          },
          {
            id: "perm8",
            name: "Message Access",
            description: "Send and receive messages",
          },
        ],
      },
      {
        id: "role3",
        name: "Buyer",
        description: "Access to buyer features",
        permissions: [
          {
            id: "perm9",
            name: "Property Viewing",
            description: "View property listings",
          },
          {
            id: "perm10",
            name: "Property Saving",
            description: "Save favorite properties",
          },
          {
            id: "perm11",
            name: "Message Access",
            description: "Send and receive messages",
          },
        ],
      },
      {
        id: "role4",
        name: "Seller",
        description: "Access to seller features",
        permissions: [
          {
            id: "perm12",
            name: "Property Listing",
            description: "Create property listings",
          },
          {
            id: "perm13",
            name: "Offer Management",
            description: "Manage offers on properties",
          },
          {
            id: "perm14",
            name: "Message Access",
            description: "Send and receive messages",
          },
        ],
      },
    ];

    return roles;
  } catch (error) {
    console.error("Error getting roles and permissions:", error);
    throw new AppError("Failed to get roles and permissions", 500);
  }
};
