import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Upload File to Cloudinary
const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
    try {
        if (!localFilePath) return null;
        
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType
        });
        
        // Delete the locally stored file
        fs.unlinkSync(localFilePath);
        
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Delete temp file on failure
        return null;
    }
};

export { uploadOnCloudinary };
