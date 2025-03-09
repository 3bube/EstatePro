import express, { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { catchAsync } from "../utils/handler";
import {
  getAdminDashboard,
  getAllUsers,
  getUserById,
  updateUserStatusById,
  updateUserRoleById,
  getAllProperties,
  getAllTransactions,
  getAdminReports,
  getRolesAndPermissions
} from "../controllers/admin.controller";

const router: Router = express.Router();

// All admin routes require authentication
router.use(authenticate);

// Admin dashboard
router.get("/dashboard", catchAsync(getAdminDashboard));

// User management
router.get("/users", catchAsync(getAllUsers));
router.get("/users/:userId", catchAsync(getUserById));
router.patch("/users/:userId/status", catchAsync(updateUserStatusById));
router.patch("/users/:userId/role", catchAsync(updateUserRoleById));

// Property management
router.get("/properties", catchAsync(getAllProperties));

// Transaction management
router.get("/transactions", catchAsync(getAllTransactions));

// Reports
router.get("/reports", catchAsync(getAdminReports));

// Roles and permissions
router.get("/roles", catchAsync(getRolesAndPermissions));

export default router;
