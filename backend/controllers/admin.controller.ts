import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../utils/handler";
import {
  getDashboardStats,
  getUsersList,
  getPropertyList,
  getTransactionsList,
  getUserDetails,
  updateUserStatus,
  getReports,
  getAdminRoles,
  updateUserRole,
} from "../services/admin.services";

// Dashboard stats for admin
export const getAdminDashboard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user is admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    console.log("here");

    const dashboardStats = await getDashboardStats();

    return res.status(200).json({
      success: true,
      data: dashboardStats,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users for admin
export const getAllUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user is admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    const { page = 1, limit = 10, status, role, search } = req.query;

    const users = await getUsersList({
      page: Number(page),
      limit: Number(limit),
      status: status as string,
      role: role as string,
      search: search as string,
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Get user details
export const getUserById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user is admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    const { userId } = req.params;

    const user = await getUserDetails(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user status (activate/deactivate/suspend)
export const updateUserStatusById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user is admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    const { userId } = req.params;
    const { status } = req.body;

    if (!status || !["active", "inactive", "suspended"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedUser = await updateUserStatus(userId, status);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: `User status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

// Update user role
export const updateUserRoleById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user is admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !["buyer", "seller", "agent", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role value",
      });
    }

    const updatedUser = await updateUserRole(userId, role);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: `User role updated to ${role}`,
    });
  } catch (error) {
    next(error);
  }
};

// Get all properties for admin
export const getAllProperties = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user is admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    const { page = 1, limit = 10, status, type, search } = req.query;

    const properties = await getPropertyList({
      page: Number(page),
      limit: Number(limit),
      status: status as string,
      type: type as string,
      search: search as string,
    });

    return res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// Get all transactions for admin
export const getAllTransactions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user is admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    const { page = 1, limit = 10, status, dateRange } = req.query;

    const transactions = await getTransactionsList({
      page: Number(page),
      limit: Number(limit),
      status: status as string,
      dateRange: dateRange as string,
    });

    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// Get reports for admin
export const getAdminReports = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user is admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    const { reportType, dateRange } = req.query;

    const reports = await getReports(reportType, dateRange);

    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

// Get roles and permissions
export const getRolesAndPermissions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user is admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    const roles = await getAdminRoles();

    return res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};
