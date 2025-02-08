import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { VirtualTryOn } from "../models/virtualTryOn.model.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { virtualTryOnService } from "../services/virtualTryOn.service.js";

const initiateVirtualTryOn = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userImageBuffer = req.file?.buffer;

    if (!userImageBuffer) {
        throw new ApiError(400, "User image is required");
    }

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    // Get product details including glasses model
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (!product.virtualTryOnEnabled) {
        throw new ApiError(400, "Virtual try-on not available for this product");
    }

    try {
        // Process virtual try-on
        const processedImageBuffer = await virtualTryOnService.processVirtualTryOn(
            userImageBuffer,
            {
                imageUrl: product.virtualTryOnModel,
                dimensions: product.virtualTryOnDimensions
            }
        );

        // Upload original and processed images to Cloudinary
        const [userImage, resultImage] = await Promise.all([
            uploadOnCloudinary(userImageBuffer),
            uploadOnCloudinary(processedImageBuffer)
        ]);

        if (!userImage || !resultImage) {
            throw new ApiError(500, "Error uploading images");
        }

        // Create virtual try-on session
        const virtualTryOn = await VirtualTryOn.create({
            user: req.user._id,
            product: productId,
            userImage: userImage.url,
            resultImage: resultImage.url,
            status: "COMPLETED",
            metadata: {
                processedAt: new Date(),
                dimensions: product.virtualTryOnDimensions
            }
        });

        await virtualTryOn.populate('product', 'name brand price images');

        return res.status(201).json(
            new ApiResponse(
                201,
                virtualTryOn,
                "Virtual try-on completed successfully"
            )
        );
    } catch (error) {
        throw new ApiError(
            error.statusCode || 500,
            error.message || "Virtual try-on processing failed"
        );
    }
});

const getVirtualTryOnResult = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    const session = await VirtualTryOn.findById(sessionId)
        .populate("product", "name brand price images virtualTryOnEnabled")
        .populate("user", "username email");

    if (!session) {
        throw new ApiError(404, "Virtual try-on session not found");
    }

    if (session.user._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access to virtual try-on session");
    }

    return res.status(200).json(
        new ApiResponse(200, session)
    );
});

const getUserTryOnHistory = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const sessions = await VirtualTryOn.find({ user: req.user._id })
        .populate("product", "name brand price images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await VirtualTryOn.countDocuments({ user: req.user._id });

    return res.status(200).json(
        new ApiResponse(200, {
            sessions,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
        })
    );
});

const deleteVirtualTryOnSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    const session = await VirtualTryOn.findById(sessionId);

    if (!session) {
        throw new ApiError(404, "Virtual try-on session not found");
    }

    if (session.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to delete this session");
    }

    await session.remove();

    return res.status(200).json(
        new ApiResponse(200, {}, "Virtual try-on session deleted successfully")
    );
});

export {
    initiateVirtualTryOn,
    getVirtualTryOnResult,
    getUserTryOnHistory,
    deleteVirtualTryOnSession
};