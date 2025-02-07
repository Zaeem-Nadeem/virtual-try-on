import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import mongoose from 'mongoose';
import { Category } from "../models/category.model.js";

const getAllProducts = asyncHandler(async (req, res) => {
    const { 
        color, 
        style, 
        priceMin, 
        priceMax, 
        sortBy = 'price:asc', // Default sort
        searchTerm,
        page = 1,
        limit = 10
    } = req.query;

    // Validate page and limit
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

    const products = await Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNumber);

    const total = await Product.countDocuments(query);

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

    const product = await Product.findById(id);
    
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
        features,
        tags
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !brand || !style || !color || !frameShape || !frameMaterial || !stock || !req.files) {
        throw new ApiError(400, "All fields and files are required");
    }

    // Validate price
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
        throw new ApiError(400, "Price must be a non-negative number");
    }

    // Validate category
    const categoryId = new mongoose.Types.ObjectId(category);
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) throw new ApiError(400, "Invalid category ID");

    // Validate stock
    const stockValue = Number(stock);
    if (isNaN(stockValue) || stockValue < 0) {
        throw new ApiError(400, "Stock must be a non-negative number");
    }

    // Upload product images

    const images = [];
    if (req.files.images) {
        for (let file of req.files.images) {
            const uploadedImage = await uploadOnCloudinary(file.path, "image");
            if (uploadedImage) images.push({ url: uploadedImage.secure_url, alt: name });
        }
    }
    if (images.length === 0) throw new ApiError(500, "Failed to upload product image");

    // Upload 3D Glasses Model only if enabled
    let glassesModel = null;
    console.log("virtual files",req.files)
    if (virtualTryOnEnabled && req.files.virtualTryOnModel) {
        glassesModel = await uploadOnCloudinary(req.files.virtualTryOnModel[0].path,"raw");
        if (!glassesModel) throw new ApiError(500, "Failed to upload 3D model");
    }

    // Create product
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
        virtualTryOnModel: glassesModel ? glassesModel.secure_url : null,
        virtualTryOnDimensions,
        images,
        features,
        tags
    });

    return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid product ID");
    }

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No fields to update");
    }

    const product = await Product.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
    );

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product updated successfully")
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
        new ApiResponse(200, {}, "Product deleted successfully")
    );
});

export {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};