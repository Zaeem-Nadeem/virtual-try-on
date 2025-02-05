import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";
import slugify from "slugify";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true })
        .populate("parent", "name slug");

    return res.status(200).json(
        new ApiResponse(200, categories)
    );
});

const createCategory = asyncHandler(async (req, res) => {
    const { name, description, parent } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        throw new ApiError(409, "Category with this name already exists");
    }

    if(req.files.image){
        const image=await uploadOnCloudinary(req.files.image,"image")
        if(!image) throw new ApiError(500, "Failed to upload category image")
    }
    const category = await Category.create({
        name,
        description,
        slug: slugify(name, { lower: true }),
        parent: parent || null,
        image,
    });
 
    return res.status(201).json(
        new ApiResponse(201, category, "Category created successfully")
    );
});

const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    if (name) {
        const existingCategory = await Category.findOne({ 
            name, 
            _id: { $ne: id } 
        });
        if (existingCategory) {
            throw new ApiError(409, "Category with this name already exists");
        }
        category.name = name;
        category.slug = slugify(name, { lower: true });
    }

    if (description) category.description = description;
    if (typeof isActive === "boolean") category.isActive = isActive;

    await category.save();

    return res.status(200).json(
        new ApiResponse(200, category, "Category updated successfully")
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    // Check if category has child categories
    const hasChildren = await Category.exists({ parent: id });
    if (hasChildren) {
        throw new ApiError(400, "Cannot delete category with child categories");
    }

    await category.remove();

    return res.status(200).json(
        new ApiResponse(200, {}, "Category deleted successfully")
    );
});

export {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};