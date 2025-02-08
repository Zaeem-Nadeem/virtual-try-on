import { Router } from "express";
import { verifyJWT, isAuthenticated, authorizeRoles, validateUserStatus } from "../middlewares/auth.middleware.js";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllOrders,
    updateOrderStatus,
    getDashboardStats
} from "../controllers/admin.controller.js";

const router = Router();

// Apply authentication and admin role check to all routes
router.use(verifyJWT);
router.use(isAuthenticated);
router.use(validateUserStatus);
router.use(authorizeRoles("ADMIN"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// User Management
router.route("/users")
    .get(getAllUsers);

router.route("/users/:id")
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// Order Management
router.route("/orders")
    .get(getAllOrders);

router.route("/orders/:id")
    .put(updateOrderStatus);

export default router;