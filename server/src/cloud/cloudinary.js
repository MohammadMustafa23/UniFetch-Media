import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(filePath, folder = "unifetch") {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder,
    });

    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
}

// ==========================
// Delete File
// ==========================
export async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });

    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw error;
  }
}