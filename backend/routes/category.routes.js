import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";
import {upload} from '../middlewares/multer.middleware.js'
const router = Router();

// Public routes
router.get("/", getAllCategories);

// Admin routes
router.use(verifyJWT);
router.use(authorizeRoles("ADMIN"));

router.post("/",upload.fields({image:"image"}) ,createCategory);
router.route("/:id")
    .put(updateCategory)
    .delete(deleteCategory);

export default router;