import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// Cloudinary Configuration
  
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET ,
  secure:true
});

// Upload File to Cloudinary


const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
    try {
        if (!localFilePath) return null;

        // Normalize the file path
        const normalizedPath = path.resolve(localFilePath).replace(/\\/g, "/");

        console.log("Uploading file from:", normalizedPath); // Debugging log

        const response = await cloudinary.uploader.upload(normalizedPath, {
            resource_type: resourceType,
            folder: "3d_models"
        });

        fs.unlinkSync(localFilePath); // Delete temp file after upload
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath); // Clean up file even if upload fails
        return null;
    }
};


export { uploadOnCloudinary };
