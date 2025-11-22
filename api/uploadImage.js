const MediaService = require("../Media/Media"); // Adjust path to your MediaService

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { image } = req.body; // Base64 data URL from Kotlin

  try {
    // Validate that image exists
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image data is required",
      });
    }

    // Upload to Cloudinary using your existing MediaService
    const imageUrl = await MediaService.uploadImage(image);

    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    // Return the Cloudinary URL
    res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      message: "Image uploaded successfully",
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
