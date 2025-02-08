import mongoose from "mongoose";

const virtualTryOnSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    userImage: {
        type: String, // cloudinary url
        required: true
    },
    resultImage: {
        type: String, // cloudinary url
        required: true
    },
    status: {
        type: String,
        enum: ["PROCESSING", "COMPLETED", "FAILED"],
        default: "PROCESSING"
    },
    metadata: {
        processedAt: Date,
        dimensions:{
            width: Number,
            height: Number
        },
        faceDetectionConfidence: Number,
        processingTime: Number
    },
    error: {
        code: String,
        message: String
    }
}, {
    timestamps: true
});

// Index for faster queries
virtualTryOnSchema.index({ user: 1, createdAt: -1 });
virtualTryOnSchema.index({ status: 1 });

export const VirtualTryOn = mongoose.model("VirtualTryOn", virtualTryOnSchema);