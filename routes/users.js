import express from 'express';
import * as userController from '../controllers/userController.js';
import { registerValidation } from '../validations/validations.js';
import handleValidationErrors from '../validations/handleValidationErrors.js'

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
*         - token
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
*         token:
*           type: string
*           description: Security token to access
*       example:
*         name: Bill Gates
*         username: billy55
*         email: billy@mail.com
*         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImN1bm5pbmdGIiwiaWF0IjoxNjc1NTkxMTEyLCJleHAiOjE2NzgxODMxMTJ9._hCcdCrFpEvvS6Xj2FmfneiGFk3STrvw99InC6uQLMw
*     UserData:
*       type: object
*       required:
*         - name
*         - username
*         - email
*         - password
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
*         password:
*           type: string
*           description: The user login password
*       example:
*         name: Bill Gates
*         username: billy55
*         email: billy@mail.com
*         password: qwerty
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

/**
* @swagger
* /users/register:
*   post:
*     summary: Create new user
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UserData'
*     responses:
*       200:
*         description: User was successfully created
*         content:
*           application/json:
*             schema:
*             $ref: '#/components/schemas/User'
*       403:
*         description: User with this email is already registered
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: User with this email is already registered
*       500:
*         description: Some server error
*/

router.post('/register', registerValidation, handleValidationErrors, userController.register);

export default router;
