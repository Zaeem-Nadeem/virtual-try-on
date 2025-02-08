import { Router } from "express";
import { verifyJWT, isAuthenticated, isOwnerOrAdmin } from "../middlewares/auth.middleware.js";
import {
    addReview,
    getProductReviews,
    deleteReview
} from "../controllers/review.controller.js";

const router = Router();

// Public routes
router.get("/products/:productId/reviews", getProductReviews);

// Protected routes
router.use(verifyJWT);
router.use(isAuthenticated);

router.post("/products/:productId/reviews", addReview);
router.delete("/reviews/:id", isOwnerOrAdmin("Review"), deleteReview);

export default router;