import { Router } from "express";
import { verifyJWT, isAuthenticated, validateUserStatus } from "../middlewares/auth.middleware.js";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
} from "../controllers/wishlist.controller.js";

const router = Router();

router.use(verifyJWT);
router.use(isAuthenticated);
router.use(validateUserStatus);

router.route("/")
    .get(getWishlist)
    .post(addToWishlist)
    .delete(clearWishlist);

router.route("/:id")
    .delete(removeFromWishlist);

export default router;