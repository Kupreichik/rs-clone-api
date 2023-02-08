import express from 'express';
import { checkAuth } from '../controllers/userController.js';
import * as pensController from '../controllers/pensController.js';
import handleValidationErrors from '../validations/handleValidationErrors.js';
import { penCreateValidation } from '../validations/validations.js';

const router = express.Router();
/**
* @swagger
* components:
*   schemas:
*     PenData:
*       type: object
*       properties:
*         title:
*           type: string
*           description: Title of pen
*         html:
*           type: string
*           description: HTML code
*         css:
*           type: string
*           description: CSS code
*         js:
*           type: string
*           description: JavaScript code
*         likesCount:
*           type: number
*           description: Number of pen likes
*         viewsCount:
*           type: number
*           description: Number of pen views
*         user:
*           type: string
*           description: User id
*         _id:
*           type: string
*           description: Pen id
*       example:
*         title: Simple Card
*         html: <div class="left"></div>
*         css: ".left { height: 300px; width: 150px; background-color: #ce6746; }"
*         js: "console.log(true)"
*         likesCount: 1
*         viewsCount: 5
*         user: 63e3d4e4d2ba97d691114311
*         _id: 63e3dbdeb1b7b5b529afde46
*/
/**
* @swagger
* tags:
*   name: Pens
*   description: The pens publishing managing API
*/
/**
* @swagger
* /pens:
*   post:
*     summary: Create new pen
*     tags: [Pens]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               title:
*                 type: string
*                 description: Title of pen
*               html:
*                 type: string
*                 description: HTML code
*               css:
*                 type: string
*                 description: CSS code
*               js:
*                 type: string
*                 description: JavaScript code
*     responses:
*       200:
*         description: Pen was successfully created
*         content:
*           application/json:
*             schema:
*             $ref: '#/components/schemas/PenData'
*       400:
*         description: Bad request
*         content:
*           application/json:
*             schema:
*               type: object
*               example:
*                 msg: CSS must be sent
*                 param: css
*                 location: body
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
router.post('/', checkAuth, penCreateValidation, handleValidationErrors, pensController.create);

export default router;
