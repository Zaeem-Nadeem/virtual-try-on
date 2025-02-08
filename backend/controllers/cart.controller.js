import { Cart } from "../models/cart.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import { StatusCodes } from "http-status-codes";

const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id })
        .populate("items.product");

    if (!cart) {
        // Create empty cart if it doesn't exist
        const newCart = await Cart.create({
            user: req.user._id,
            items: []
        });
        return res.status(200)
            .json(new ApiResponse(200, newCart, "Cart retrieved successfully"));
    }

    return res.status(200)
        .json(new ApiResponse(200, cart, "Cart retrieved successfully"));
});

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, price } = req.body;

    if (!productId || !quantity || !price) {
        throw new ApiError(400, "All fields are required");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: [{
                product: productId,
                quantity,
                price
            }]
        });
    } else {
        const existingItem = cart.items.find(item => 
            item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price
            });
        }
        await cart.save();
    }

    return res.status(200)
        .json(new ApiResponse(200, cart, "Item added to cart successfully"));
});

const updateCartItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
        throw new ApiError(400, "Quantity is required");
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const cartItem = cart.items.find(item => 
        item._id.toString() === id
    );

    if (!cartItem) {
        throw new ApiError(404, "Cart item not found");
    }

    cartItem.quantity = quantity;
    await cart.save();

    return res.status(200)
        .json(new ApiResponse(200, cart, "Cart item updated successfully"));
});

const removeFromCart = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.items = cart.items.filter(item => 
        item._id.toString() !== id
    );
    await cart.save();

    return res.status(200)
        .json(new ApiResponse(200, cart, "Item removed from cart successfully"));
});

const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.items = [];
    await cart.save();

    return res.status(200)
        .json(new ApiResponse(200, cart, "Cart cleared successfully"));
});

export {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};