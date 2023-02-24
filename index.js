import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/users.js';
import pensRouter from './routes/pens.js';
import uploadRouter from './routes/upload.js';
import { createRoom, onSocketConnection } from './controllers/socketController.js'
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3033;
export const BASE_URL = 'https://rs-clone-api.onrender.com';
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

export const app = express();
const server = http.createServer(app);
export const io = new Server(server);


mongoose.set('strictQuery', true);
mongoose
  .connect(
    process.env.MONGODB_URI
  )
  .then(() => console.log('DB connected successfully'))
  .catch((err) => console.log('DB error', err));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodePen-Clone API',
      version: '1.0.0',
      description: 'Express CodePen-Clone API',
    },
    servers: [
      {
        url: BASE_URL,
      },
    ],
  },
  apis: ['./routes/*.js'],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());
app.use(
  cors({
    origin: [
      'https://rss-clone.netlify.app',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  })
);
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/pens', pensRouter);
app.use('/upload', uploadRouter);
app.use('/images', express.static('images'));

app.post('/create-room', createRoom);

io.on('connection', onSocketConnection);

server.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log(`Server is running on port ${PORT}`);
});
