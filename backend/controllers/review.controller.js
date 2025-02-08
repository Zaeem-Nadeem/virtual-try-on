import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";

const addReview = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user._id;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Check if user has already reviewed
    const existingReview = await Review.findOne({
        user: userId,
        product: productId
    });

    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this product");
    }

    // Check if user has purchased the product
    const hasOrdered = await Order.exists({
        user: userId,
        "items.product": productId,
        status: "DELIVERED"
    });

    const review = await Review.create({
        user: userId,
        product: productId,
        rating,
        title,
        comment,
        isVerifiedPurchase: !!hasOrdered
    });

    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
        "ratings.average": avgRating,
        "ratings.count": reviews.length
    });

    return res.status(201).json(
        new ApiResponse(201, review, "Review added successfully")
    );
});

const getProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const reviews = await Review.find({ product: productId })
        .populate("user", "username avatar")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Review.countDocuments({ product: productId });

    return res.status(200).json(
        new ApiResponse(200, {
            reviews,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
        })
    );
});

const deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Check if user is owner or admin
    if (review.user.toString() !== userId.toString() && req.user.role !== "ADMIN") {
        throw new ApiError(403, "You are not authorized to delete this review");
    }

    await review.remove();

    // Update product rating
    const productId = review.product;
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.length ? 
        reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length : 0;

    await Product.findByIdAndUpdate(productId, {
        "ratings.average": avgRating,
        "ratings.count": reviews.length
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Review deleted successfully")
    );
});

export {
    addReview,
    getProductReviews,
    deleteReview
};