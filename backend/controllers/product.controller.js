import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import mongoose from 'mongoose';
import { Category } from "../models/category.model.js";

const getAllProducts = asyncHandler(async (req, res) => {
    const { 
        color, 
        style, 
        priceMin, 
        priceMax, 
        sortBy = 'price:asc',
        searchTerm,
        page = 1,
        limit = 10
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
        throw new ApiError(400, "Invalid page or limit value");
    }

    const query = {};

    if (color) query.color = color;
    if (style) query.style = style;
    if (priceMin || priceMax) {
        query.price = {};
        if (priceMin) query.price.$gte = parseFloat(priceMin);
        if (priceMax) query.price.$lte = parseFloat(priceMax);
    }
    if (searchTerm) {
        query.$text = { $search: searchTerm };
    }

    const sortOptions = {};
    if (sortBy) {
        const [field, order] = sortBy.split(':');
        sortOptions[field] = order === 'desc' ? -1 : 1;
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [products, total] = await Promise.all([
        Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNumber)
            .populate('category', 'name'),
        Product.countDocuments(query)
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            products,
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            total
        })
    );
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findById(id).populate('category', 'name');
    
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, product)
    );
});

const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        category,
        brand,
        style,
        color,
        frameShape,
        frameMaterial,
        stock,
        virtualTryOnEnabled = true,
        virtualTryOnDimensions,
        specifications,
        features,
        tags
    } = req.body;

    if (!name || !description || !price || !category || !brand || 
        !style || !color || !frameShape || !frameMaterial || !stock) {
        throw new ApiError(400, "All required fields must be provided");
    }

    if (!req.files?.images || !req.files.images.length) {
        throw new ApiError(400, "At least one product image is required");
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
        throw new ApiError(400, "Price must be a non-negative number");
    }

    const categoryId = new mongoose.Types.ObjectId(category);
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) throw new ApiError(400, "Invalid category ID");

    const stockValue = parseInt(stock);
    if (isNaN(stockValue) || stockValue < 0) {
        throw new ApiError(400, "Stock must be a non-negative integer");
    }

    const images = [];
    for (const file of req.files.images) {
        const uploadedImage = await uploadOnCloudinary(file.path, "image");
        if (!uploadedImage) throw new ApiError(500, "Failed to upload product image");
        images.push({ url: uploadedImage.secure_url, alt: name });
    }

    let virtualTryOnModel = null;
    if (virtualTryOnEnabled && req.files?.virtualTryOnModel?.[0]) {
        const uploadedModel = await uploadOnCloudinary(
            req.files.virtualTryOnModel[0].path,
            "raw"
        );
        if (!uploadedModel) throw new ApiError(500, "Failed to upload 3D model");
        virtualTryOnModel = uploadedModel.secure_url;
    }

    const product = await Product.create({
        name,
        description,
        price: priceValue,
        category: categoryId,
        brand,
        style,
        color,
        frameShape,
        frameMaterial,
        stock: stockValue,
        virtualTryOnEnabled,    
        virtualTryOnModel,
        virtualTryOnDimensions,
        specifications,
        images,
        features: Array.isArray(features) ? features : [],
        tags: Array.isArray(tags) ? tags : []
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name');

    return res.status(201).json(
        new ApiResponse(201, populatedProduct, "Product created successfully")
    );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid product ID");
    }

    if (Object.keys(updates).length === 0 && !req.files) {
        throw new ApiError(400, "No updates provided");
    }

    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (updates.category) {
        const categoryExists = await Category.findById(updates.category);
        if (!categoryExists) throw new ApiError(400, "Invalid category ID");
    }

    if (updates.price) {
        const priceValue = parseFloat(updates.price);
        if (isNaN(priceValue) || priceValue < 0) {
            throw new ApiError(400, "Price must be a non-negative number");
        }
        updates.price = priceValue;
    }

    if (updates.stock) {
        const stockValue = parseInt(updates.stock);
        if (isNaN(stockValue) || stockValue < 0) {
            throw new ApiError(400, "Stock must be a non-negative integer");
        }
        updates.stock = stockValue;
    }

    if (req.files?.images) {
        const images = [];
        for (const file of req.files.images) {
            const uploadedImage = await uploadOnCloudinary(file.path, "image");
            if (!uploadedImage) throw new ApiError(500, "Failed to upload product image");
            images.push({ url: uploadedImage.secure_url, alt: updates.name || product.name });
        }
        updates.images = images;
    }

    if (req.files?.virtualTryOnModel) {
        const uploadedModel = await uploadOnCloudinary(
            req.files.virtualTryOnModel[0].path,
            "raw"
        );
        if (!uploadedModel) throw new ApiError(500, "Failed to upload 3D model");
        updates.virtualTryOnModel = uploadedModel.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
    ).populate('category', 'name');

    return res.status(200).json(
        new ApiResponse(200, updatedProduct, "Product updated successfully")
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Product deleted successfully")
    );
});

export {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
