import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    image: {
        type: String // Cloudinary URL
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

categorySchema.index({ name: 'text', description: 'text' });

export const Category = mongoose.model("Category", categorySchema);