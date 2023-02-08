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
*         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2UzZDRlNGQyYmE5N2Q2OTExMTQzMTEiLCJpYXQiOjE2NzU4NzU1NTYsImV4cCI6MTY3ODQ2NzU1Nn0.Yv_vNg5lb4KiL3oXpQkBShE6Ovu7GfYY3zPexvPPnY4
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
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
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
* /users/me:
*   get:
*     summary: Returns the data of an authorized user
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: User authorization confirmed
*         content:
*           application/json:
*             schema:
*             $ref: '#/components/schemas/User'
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
router.get('/me', userController.checkAuth, userController.getMe);

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
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Failed to register
*/
router.post('/register', registerValidation, handleValidationErrors, userController.register);

/**
* @swagger
* /users/login:
*   post:
*     summary: User authorization
*     tags: [Users]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               identifier:
*                 type: string
*                 description: Username or email for login
*                 example: billy55
*               password:
*                 type: string
*                 description: Password for login
*                 example: qwerty
*     responses:
*       200:
*         description: User was successfully login
*         content:
*           application/json:
*             schema:
*             $ref: '#/components/schemas/User'
*       403:
*         description: Username or password is incorrect
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: The username or password you entered is incorrect, please try again
*       500:
*         description: Some server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Failed to login
*/
router.post('/login', userController.login);

export default router;
