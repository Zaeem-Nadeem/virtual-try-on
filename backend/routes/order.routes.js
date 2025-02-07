import { Router } from "express";
import { verifyJWT, isAuthenticated, validateUserStatus } from "../middlewares/auth.middleware.js";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus
} from "../controllers/order.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(isAuthenticated);
router.use(validateUserStatus);

router.route("/")
    .post(createOrder)
    .get(getAllOrders);

router.route("/:id")
    .get(getOrderById)
    .put(updateOrderStatus)
    .delete(cancelOrder);

export default router;