import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(file) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "dummy-app",
    });
    return result;
  } catch (error) {
    throw new Error("Image upload failed");
  }
}

export async function deleteImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error("Image deletion failed");
  }
}
