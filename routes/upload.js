import express from 'express';
import { imgRemove, imgUpload } from '../controllers/uploadController.js';
import { checkAuth } from '../controllers/userController.js';

const router = express.Router();

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
*                 avatar:
*                   type: string
*                   example: https://rs-clone-api.onrender.com/images/63e3d4e4d2ba97d691114311.jpg
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
router.post('/', checkAuth, imgUpload);

/**
* @swagger
* tags:
*   name: Uploads
*   description: Images upload
*/
/**
* @swagger
* /upload:
*   delete:
*     summary: Remove avatar user image and returns default avatar url
*     tags: [Uploads]
*     responses:
*       200:
*         description: The image was deleted successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 avatar:
*                   type: string
*                   example: https://rs-clone-api.onrender.com/images/user-default-avatar.webp
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
*                   example: Some server error
*/
router.delete('/', checkAuth, imgRemove);

export default router;
