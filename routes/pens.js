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
*         _id:
*           type: string
*           description: Uniq id of pen
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
*           type: object
*           description: Pen author data
*       example:
*         _id: 63e3dbdeb1b7b5b529afde46
*         title: Simple Card
*         html: <div class="left"></div>
*         css: ".left { height: 300px; width: 150px; background-color: #ce6746; }"
*         js: "console.log(true)"
*         likesCount: 1
*         viewsCount: 5
*         user: 
*           name: Bill Gates
*           username: billy55
*           avatar: https://rs-clone-api.onrender.com/images/63e49eebee7d38e87d48086d.webp
*     Pen:
*       type: object
*       properties:
*         _id:
*           type: string
*           description: Uniq id of pen
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
*           description: Pen author id
*       example:
*         _id: 63e3dbdeb1b7b5b529afde46
*         title: Simple Card
*         html: <div class="left"></div>
*         css: ".left { height: 300px; width: 150px; background-color: #ce6746; }"
*         js: "console.log(true)"
*         likesCount: 1
*         viewsCount: 5
*         user: 63e4d9af9e4d3c6019306b3f
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
*   get:
*     summary: Returns json pens data
*     tags: [Pens]
*     parameters:
*       - name: _limit
*         in: query
*         description: Count of getting pens (default value is 10)
*         required: false
*         schema:
*           type: integer
*         style: form
*         example: 4
*     responses:
*       200:
*         description: Pen was successfully created
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 $ref: '#/components/schemas/PenData'
*         headers:
*           X-Total-Count: 
*             description: The number of pens in database
*             schema:
*               type: integer
*               example: 15237
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
router.get('/', pensController.getAll);

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
*             $ref: '#/components/schemas/Pen'
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
