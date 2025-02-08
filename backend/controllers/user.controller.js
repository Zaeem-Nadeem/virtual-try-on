import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import bcrypt from "bcryptjs";

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, user)
    );
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, email, avatar } = req.body;
    const userId = req.user._id;

    if (!fullName && !email && !avatar) {
        throw new ApiError(400, "Please provide at least one field to update");
    }

    // Check email uniqueness if being updated
    if (email) {
        const existingUser = await User.findOne({ 
            email, 
            _id: { $ne: userId } 
        });
        if (existingUser) {
            throw new ApiError(409, "Email already in use");
        }
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                fullName: fullName || req.user.fullName,
                email: email || req.user.email,
                avatar: avatar || req.user.avatar
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, user, "Profile updated successfully")
    );
});

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both old and new password are required");
    }

    const user = await User.findById(req.user._id);

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid old password");
    }

    if (newPassword.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    );
});

// Address Management
const getAddresses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select("address");

    return res.status(200).json(
        new ApiResponse(200, user.address || {})
    );
});

const addAddress = asyncHandler(async (req, res) => {
    const { street, city, state, country, zipCode } = req.body;

    if (!street || !city || !state || !country || !zipCode) {
        throw new ApiError(400, "All address fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                address: { street, city, state, country, zipCode }
            }
        },
        { new: true }
    ).select("address");

    return res.status(200).json(
        new ApiResponse(200, user.address, "Address added successfully")
    );
});

const updateAddress = asyncHandler(async (req, res) => {
    const { street, city, state, country, zipCode } = req.body;

    const updateFields = {};
    if (street) updateFields["address.street"] = street;
    if (city) updateFields["address.city"] = city;
    if (state) updateFields["address.state"] = state;
    if (country) updateFields["address.country"] = country;
    if (zipCode) updateFields["address.zipCode"] = zipCode;

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "Please provide at least one field to update");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateFields },
        { new: true }
    ).select("address");

    return res.status(200).json(
        new ApiResponse(200, user.address, "Address updated successfully")
    );
});

const deleteAddress = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: { address: 1 }
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Address deleted successfully")
    );
});

// Order History
const getUserOrders = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.user._id };

    if (status) {
        query.status = status.toUpperCase();
    }

    const orders = await Order.find(query)
        .populate("items.product", "name price images")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

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

const getOrderDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findOne({
        _id: id,
        user: req.user._id
    }).populate("items.product", "name price images description");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(200, order)
    );
});

export {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getUserOrders,
    getOrderDetails
};