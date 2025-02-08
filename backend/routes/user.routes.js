import { Router } from "express";
import {
  verifyJWT,
  isAuthenticated,
  authorizeRoles,
  validateUserStatus,
} from "../middlewares/auth.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getUserOrders,
  getOrderDetails,
} from "../controllers/user.controller.js";
const router = Router();

// Apply authentication to all user routes
router.use(verifyJWT);
router.use(isAuthenticated);
router.use(validateUserStatus);

// User profile routes
router.route("/profile").get(getUserProfile).put(updateUserProfile);

router.route("/change-password").put(changePassword);

// Address management
router.route("/addresses").get(getAddresses).post(addAddress);

router.route("/addresses/:id").put(updateAddress).delete(deleteAddress);

// Order history
router.route("/orders").get(getUserOrders);

router.route("/orders/:id").get(getOrderDetails);

export default router;
