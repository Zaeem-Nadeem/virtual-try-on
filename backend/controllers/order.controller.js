import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";

const createOrder = asyncHandler(async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items?.length) {
        throw new ApiError(400, "Order must contain at least one item");
    }

    // Calculate total amount from items
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = await Order.create({
        user: req.user._id,
        items,
        shippingAddress,
        totalAmount,
        paymentMethod
    });

    return res
        .status(201)
        .json(new ApiResponse(201, order, "Order created successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate("items.product")
        .sort("-createdAt");

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id
    }).populate("items.product");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order retrieved successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.status === "CANCELLED") {
        throw new ApiError(400, "Cannot update cancelled order");
    }

    if (order.status === "DELIVERED") {
        throw new ApiError(400, "Cannot update delivered order");
    }

    order.status = status;
    await order.save();

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order status updated successfully"));
});

const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.status === "DELIVERED") {
        throw new ApiError(400, "Cannot cancel delivered order");
    }

    if (order.status === "CANCELLED") {
        throw new ApiError(400, "Order is already cancelled");
    }

    order.status = "CANCELLED";
    await order.save();

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

export {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
};