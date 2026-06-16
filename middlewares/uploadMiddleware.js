const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Configurar Cloudinary con tus credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar el almacenamiento
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'albergue', // Carpeta que se creará en tu Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Reduce el peso de la imagen
  }
});

const upload = multer({ storage: storage });

module.exports = upload;