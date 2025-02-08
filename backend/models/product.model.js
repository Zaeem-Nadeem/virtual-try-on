import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        index: true
    },
    images: [{
        url: String,
        alt: String
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
        index: true
    },
    brand: {
        type: String,
        required: true,
        index: true
    },
    style: {
        type: String,
        required: true,
        index: true
    },
    color: {
        type: String,
        required: true,
        index: true
    },
    frameShape: {
        type: String,
        required: true,
        index: true
    },
    frameMaterial: {
        type: String,
        required: true
    },
    virtualTryOnEnabled: {
        type: Boolean,
        default: true
    },
    virtualTryOnModel: {
        type: String, // URL to 3D model or overlay image
        required: function() {
            return this.virtualTryOnEnabled;
        }
    },
    virtualTryOnDimensions: {
        width: Number,
        height: Number
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        index: true
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    specifications: {
        lensWidth: Number,
        bridgeWidth: Number,
        templeLength: Number,
        lensHeight: Number,
        totalWidth: Number,
        weight: Number
    },
    features: [{
        type: String
    }],
    tags: [{
        type: String,
        index: true
    }]
}, {
    timestamps: true
});

// Text search index
productSchema.index(
    { 
        name: 'text', 
        description: 'text',
        brand: 'text',
        style: 'text',
        tags: 'text'
    },
    {
        weights: {
            name: 10,
            brand: 5,
            style: 3,
            description: 1,
            tags: 2
        }
    }
);

// Compound indexes for common queries  
productSchema.index({ brand: 1, style: 1, price: 1 });
productSchema.index({ frameShape: 1, color: 1, price: 1 });

export const Product = mongoose.model("Product", productSchema);