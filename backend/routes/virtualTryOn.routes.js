import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    initiateVirtualTryOn,
    getVirtualTryOnResult,
    getUserTryOnHistory,
    deleteVirtualTryOnSession
} from "../controllers/virtualTryOn.controller.js";

const router = Router();

router.use(verifyJWT); // All virtual try-on routes require authentication

router.route("/")
    .post(
        upload.single("userImage"),
        initiateVirtualTryOn
    )
    .get(getUserTryOnHistory);

router.route("/:sessionId")
    .get(getVirtualTryOnResult)
    .delete(deleteVirtualTryOnSession);

export default router;