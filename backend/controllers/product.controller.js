import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

const getAllProducts = asyncHandler(async (req, res) => {
    const { 
        color, 
        style, 
        priceMin, 
        priceMax, 
        sortBy, 
        searchTerm,
        page = 1,
        limit = 10
    } = req.query;

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

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            products,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        })
    );
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
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
        stock
    } = req.body;

    if (!name || !description || !price || !category || !brand || !style || !color || !frameShape || !frameMaterial || !stock || !req.files) {
        throw new ApiError(400, "All fields and files are required");
    }

    const productImage = await uploadOnCloudinary(req.files.image.path, "image");
    if (!productImage) throw new ApiError(500, "Failed to upload product image");

    // Upload 3D Glasses Model to Cloudinary
    const glassesModel = await uploadOnCloudinary(req.files.virtualTryOnModel.path, "raw");
    if (!glassesModel) throw new ApiError(500, "Failed to upload 3D model");

   const product = await Product.create({
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
        virtualTryOnModel: glassesModel.secure_url, // 3D Model URL
        image: productImage.secure_url // Product Image URL
    });

    return res.status(201).json(
        new ApiResponse(201, product, "Product created successfully")
    );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

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