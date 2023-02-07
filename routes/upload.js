import express from 'express';
import fs from 'fs';
import multer from 'multer';
import { checkAuth } from '../controllers/userController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('images')) {
      fs.mkdirSync('images');
    }
    cb(null, 'images');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/**
* @swagger
* tags:
*   name: Uploads
*   description: Images upload
*/
/**
* @swagger
* /upload:
*   post:
*     summary: Upload an image
*     tags: [Uploads]
*     requestBody:
*       content:
*         image/*:
*           schema:
*             type: string
*     responses:
*       200:
*         description: The image was uploaded successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 url:
*                   type: string
*                   example: https://rs-clone-api.onrender.com/images/3825682734981270.jpg
*       403:
*         description: Access token is missing or invalid
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Access token is missing or invalid
*       500:
*         description: Some server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Failed to upload
*/
router.post('/', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/images/${req.file.originalname}`,
  });
});

export default router;
