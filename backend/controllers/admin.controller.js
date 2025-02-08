import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

// User Management
const getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (role) query.role = role;
    if (search) {
        query.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { fullName: { $regex: search, $options: 'i' } }
        ];
    }

    const users = await User.find(query)
        .select("-password -refreshToken")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            users,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
        })
    );
});

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id)
        .select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user)
    );
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, status, ...updateData } = req.body;

    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Only allow specific fields to be updated
    const allowedUpdates = ["fullName", "email", "role", "status"];
    Object.keys(updateData).forEach(key => {
        if (!allowedUpdates.includes(key)) {
            delete updateData[key];
        }
    });

    if (role) updateData.role = role;
    if (status) updateData.status = status;

    const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User updated successfully")
    );
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.role === "ADMIN") {
        throw new ApiError(403, "Admin users cannot be deleted");
    }

    await user.remove();

    return res.status(200).json(
        new ApiResponse(200, {}, "User deleted successfully")
    );
});

// Order Management
const getAllOrders = asyncHandler(async (req, res) => {
    const { 
        page = 1, 
        limit = 10, 
        status, 
        startDate, 
        endDate,
        minAmount,
        maxAmount
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = {};

    if (status) query.status = status;
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (minAmount || maxAmount) {
        query.totalAmount = {};
        if (minAmount) query.totalAmount.$gte = parseFloat(minAmount);
        if (maxAmount) query.totalAmount.$lte = parseFloat(maxAmount);
    }

    const orders = await Order.find(query)
        .populate("user", "username email fullName")
        .populate("items.product", "name price images")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            orders,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
        })
    );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    const allowedStatusTransitions = {
        "PENDING": ["PROCESSING", "CANCELLED"],
        "PROCESSING": ["SHIPPED", "CANCELLED"],
        "SHIPPED": ["DELIVERED", "CANCELLED"],
        "DELIVERED": [],
        "CANCELLED": []
    };

    if (!allowedStatusTransitions[order.status].includes(status)) {
        throw new ApiError(400, `Cannot transition from ${order.status} to ${status}`);
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    
    await order.save();

    return res.status(200).json(
        new ApiResponse(200, order, "Order status updated successfully")
    );
});

// Analytics and Dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    const [
        totalUsers,
        totalOrders,
        totalRevenue,
        recentOrders,
        userStats,
        productStats
    ] = await Promise.all([
        User.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
            { $match: { status: { $ne: "CANCELLED" } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]),
        Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "username")
            .select("totalAmount status createdAt"),
        User.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            }
        ]),
        Product.aggregate([
            {
                $match: { stock: { $lt: 10 } }
            },
            {
                $project: {
                    name: 1,
                    stock: 1,
                    price: 1
                }
            }
        ])
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            recentOrders,
            userGrowth: userStats,
            lowStockProducts: productStats
        })
    );
});

export {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllOrders,
    updateOrderStatus,
    getDashboardStats
};