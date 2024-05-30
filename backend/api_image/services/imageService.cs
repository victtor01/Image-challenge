using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;

namespace api_image.Services
{
    /// <summary>
    /// Service for handling image uploads and adding a watermark to the uploaded images.
    /// </summary>
    public class ImageService
    {
        private readonly string IMAGE_PATH = "public/images/example.png";

        /// <summary>
        /// Uploads a collection of image files, applies a watermark to each image, and returns the modified images.
        /// </summary>
        /// <param name="files">A collection of image files to be uploaded and processed.</param>
        /// <returns>A list of byte arrays representing the images with the watermark applied.</returns>
        /// <exception cref="ArgumentException">Thrown when no files are provided for upload.</exception>
        public async Task<List<byte[]>> Upload(ICollection<IFormFile> files)
        {
            if (files == null || files.Count == 0) throw new ArgumentException("No files provided for upload.");

            var data = new List<byte[]>();

            using var watermarkImage = LoadWatermarkImage();

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    byte[] imageBytes = await ConvertToByteArrayAsync(formFile);
                    byte[] watermarkedImage = AddWatermark(imageBytes, watermarkImage);
                    data.Add(watermarkedImage);
                }
            }

            return data;
        }

        /// <summary>
        /// Loads the watermark image from the file system.
        /// </summary>
        /// <returns>An Image object representing the watermark.</returns>
        /// <exception cref="FileNotFoundException">Thrown when the watermark image file is not found.</exception>
        private Image LoadWatermarkImage()
        {
            if (!File.Exists(IMAGE_PATH))
            {
                throw new FileNotFoundException("Watermark image not found.", IMAGE_PATH);
            }

            return Image.FromFile(IMAGE_PATH);
        }

        /// <summary>
        /// Converts an IFormFile to a byte array.
        /// </summary>
        /// <param name="formFile">The file to be converted.</param>
        /// <returns>A byte array representing the file's contents.</returns>
        private static async Task<byte[]> ConvertToByteArrayAsync(IFormFile formFile)
        {
            using var stream = new MemoryStream();
            await formFile.CopyToAsync(stream);
            return stream.ToArray();
        }

        /// <summary>
        /// Adds a watermark to an image.
        /// </summary>
        /// <param name="imageBytes">The byte array representing the original image.</param>
        /// <param name="watermarkImage">The Image object representing the watermark.</param>
        /// <returns>A byte array representing the image with the watermark applied.</returns>
        private static byte[] AddWatermark(byte[] imageBytes, Image watermarkImage)
        {
            using var originalImageStream = new MemoryStream(imageBytes);
            using var originalImage = Image.FromStream(originalImageStream);
            using var graphics = Graphics.FromImage(originalImage);

            int xPosition = 10; // X position for the watermark in the bottom-left corner
            int yPosition = originalImage.Height - watermarkImage.Height - 10; // Y position for the watermark in the bottom-left corner

            graphics.DrawImage(watermarkImage, xPosition, yPosition, watermarkImage.Width, watermarkImage.Height);

            using var resultStream = new MemoryStream();
            originalImage.Save(resultStream, originalImage.RawFormat);
            
            return resultStream.ToArray();
        }
    }
}