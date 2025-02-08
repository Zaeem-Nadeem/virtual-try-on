import * as tf from '@tensorflow/tfjs-node';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { createCanvas, loadImage } from 'canvas';
import sharp from 'sharp';
import { ApiError } from '../utils/ApiError.js';

class VirtualTryOnService {
    constructor() {
        this.model = null;
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            try {
                this.model = await faceLandmarksDetection.load(
                    faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
                    { maxFaces: 1 }
                );
                this.initialized = true;
            } catch (error) {
                throw new ApiError(500, "Failed to initialize face detection model");
            }
        }
    }

    async detectFacialLandmarks(imageBuffer) {
        await this.initialize();

        try {
            // Convert image buffer to tensor
            const image = await loadImage(imageBuffer);
            const tensor = tf.browser.fromPixels(image);
            
            // Detect facial landmarks
            const predictions = await this.model.estimateFaces({
                input: tensor,
                returnTensors: false,
                flipHorizontal: false,
                predictIrises: true
            });

            if (!predictions.length) {
                throw new ApiError(400, "No face detected in the image");
            }

            return predictions[0];
        } catch (error) {
            throw new ApiError(500, "Error detecting facial landmarks: " + error.message);
        }
    }

    async applyGlasses(imageBuffer, glassesModel, landmarks) {
        try {
            const canvas = createCanvas(800, 600);
            const ctx = canvas.getContext('2d');

            // Load and draw original image
            const image = await loadImage(imageBuffer);
            ctx.drawImage(image, 0, 0, 800, 600);

            // Calculate glasses position based on facial landmarks
            const leftEye = landmarks.annotations.leftEyeIris[0];
            const rightEye = landmarks.annotations.rightEyeIris[0];
            
            // Calculate glasses dimensions and position
            const eyeDistance = Math.sqrt(
                Math.pow(rightEye[0] - leftEye[0], 2) + 
                Math.pow(rightEye[1] - leftEye[1], 2)
            );
            
            const glassesWidth = eyeDistance * 2.5;
            const glassesHeight = glassesWidth * 0.4;
            const glassesX = leftEye[0] - glassesWidth * 0.25;
            const glassesY = leftEye[1] - glassesHeight * 0.5;

            // Load and draw glasses
            const glassesImage = await loadImage(glassesModel.imageUrl);
            ctx.drawImage(
                glassesImage,
                glassesX,
                glassesY,
                glassesWidth,
                glassesHeight
            );

            // Convert canvas to buffer
            const resultBuffer = canvas.toBuffer('image/png');
            
            // Optimize image
            const optimizedBuffer = await sharp(resultBuffer)
                .resize(800, 600, { fit: 'inside' })
                .jpeg({ quality: 80 })
                .toBuffer();

            return optimizedBuffer;
        } catch (error) {
            throw new ApiError(500, "Error applying glasses overlay: " + error.message);
        }
    }

    async processVirtualTryOn(userImageBuffer, glassesModel) {
        try {
            const landmarks = await this.detectFacialLandmarks(userImageBuffer);
            const resultImage = await this.applyGlasses(userImageBuffer, glassesModel, landmarks);
            return resultImage;
        } catch (error) {
            throw new ApiError(500, "Virtual try-on processing failed: " + error.message);
        }
    }
}

export const virtualTryOnService = new VirtualTryOnService();