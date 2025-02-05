import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/")
    .get(getAllProducts)
    .post(verifyJWT, authorizeRoles("ADMIN"), upload.fields([{ name: "images" }, { name: "virtualTryOnModel" }]), createProduct);

router.route("/:id")
    .get(getProductById)
    .put(verifyJWT, authorizeRoles("ADMIN"), updateProduct)
    .delete(verifyJWT, authorizeRoles("ADMIN"), deleteProduct);

export default router;