import { uploadToCloudinary } from "../cloud/cloudinary.js";

async function test() {
  try {
    const filePath = String.raw`C:\Users\ff774\OneDrive\Attachments\OneDrive\Desktop\UniFetch\server\downloads\Vasai-Nallasopara flood relief work❤️ #humanity #hussainmansuri.mp4`;
    const result = await uploadToCloudinary(filePath, "downloads");
  } catch (error) {
    console.error(error);
  }
}

test();