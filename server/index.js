const express = require('express');
const cloudinary = require('cloudinary').v2;
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors=require('cors');

dotenv.config();

const app = express();
const port = 8000;

app.use(cors("*"));

// Middleware to parse JSON body
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for large images

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route for image upload
app.post('/upload', async (req, res) => {
  const { image } = req.body; // Image should be a base64 string
  if (!image) {
    return res.status(400).json({ message: 'No image provided' });
  }

  try {
    // Upload the base64 image to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'ImageUploader', // Optional: specify folder
    });


    return res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url, // URL of the uploaded image
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Image upload failed', error });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
