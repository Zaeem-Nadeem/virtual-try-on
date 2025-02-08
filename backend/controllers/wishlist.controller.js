import { Wishlist } from "../models/wishlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import { StatusCodes } from "http-status-codes";

const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
        .populate("products");

    if (!wishlist) {
        const newWishlist = await Wishlist.create({
            user: req.user._id,
            products: []
        });
        return res.status(201)
            .json(new ApiResponse(201, newWishlist, "New wishlist created successfully"));
    }

    return res.status(200)
        .json(new ApiResponse(200, wishlist, "Wishlist retrieved successfully"));
});

const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: req.user._id,
            products: [productId]
        });
        return res.status(201)
            .json(new ApiResponse(201, wishlist, "Wishlist created with new product"));
    }

    // Check if product already exists in wishlist
    if (wishlist.products.includes(productId)) {
        throw new ApiError(400, "Product already in wishlist");
    }

    wishlist.products.push(productId);
    await wishlist.save();

    return res.status(200)
        .json(new ApiResponse(200, wishlist, "Product added to wishlist successfully"));
});

const removeFromWishlist = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        throw new ApiError(404, "Wishlist not found");
    }

    if (!wishlist.products.includes(id)) {
        throw new ApiError(404, "Product not found in wishlist");
    }

    wishlist.products = wishlist.products.filter(productId => 
        productId.toString() !== id
    );
    await wishlist.save();

    return res.status(200)
        .json(new ApiResponse(200, wishlist, "Product removed from wishlist successfully"));
});

const clearWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        throw new ApiError(404, "Wishlist not found");
    }

    wishlist.products = [];
    await wishlist.save();

    return res.status(200)
        .json(new ApiResponse(200, wishlist, "Wishlist cleared successfully"));
});

export {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
};