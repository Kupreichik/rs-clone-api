import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - name
*         - username
*         - email
*         - passwordHash
*       properties:
*         name:
*           type: string
*           description: The name of user
*         username:
*           type: string
*           description: The uniq login username
*         email:
*           type: string
*           description: The uniq user email
*         passwordHash:
*           type: string
*           description: The computed password hash
*       example:
*         name: Bill Gates
*         username: billy55
*         email: billy@mail.com
*         passwordHash: $2b$10$ie7tCwbBDBg81f.SLcXdAuZOHZM5Rw5Fogfr8fAzjnTVxXxDxxJkW
*/
/**
* @swagger
* tags:
*   name: Users
*   description: The users managing API
*/

/**
* @swagger
* /users/username/{uniqName}:
*   get:
*     summary: Returns canUse false if username already used or canUse true if it is free
*     tags: [Users]
*     parameters:
*       - name: uniqName
*         in: path
*         required: true
*         description: The uniq login username
*         schema:
*           type: string
*     responses:
*       200:
*         description: A response object
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 canUse:
*                   type: boolean
*                   example: false
*       500:
*         description: Some server error
*/

router.get('/username/:uniqName', userController.checkUsername);

export default router;
