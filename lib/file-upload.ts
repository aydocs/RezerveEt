import { v2 as cloudinary } from "cloudinary"
import { config } from "./config"

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
})

export class FileUploadService {
  // Resim yükle
  static async uploadImage(file: File, folder = "rezerveet"): Promise<string> {
    try {
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString("base64")
      const dataURI = `data:${file.type};base64,${base64}`

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: folder,
        resource_type: "image",
        transformation: [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }, { format: "webp" }],
      })

      return result.secure_url
    } catch (error) {
      console.error("Image upload error:", error)
      throw new Error("Resim yüklenemedi")
    }
  }

  // Çoklu resim yükle
  static async uploadMultipleImages(files: File[], folder = "rezerveet"): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadImage(file, folder))
      return await Promise.all(uploadPromises)
    } catch (error) {
      console.error("Multiple image upload error:", error)
      throw new Error("Resimler yüklenemedi")
    }
  }

  // Resim sil
  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId)
      return result.result === "ok"
    } catch (error) {
      console.error("Image delete error:", error)
      return false
    }
  }
}
