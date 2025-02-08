import { Router } from "express";
import { verifyJWT, isAuthenticated, validateUserStatus } from "../middlewares/auth.middleware.js";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from "../controllers/cart.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(isAuthenticated);
router.use(validateUserStatus);

router.route("/")
    .get(getCart)
    .post(addToCart)
    .delete(clearCart);

router.route("/:id")
    .put(updateCartItem)
    .delete(removeFromCart);

export default router;