import { nanoid } from 'nanoid';
import UserModel from '../models/User.js';
import { io } from '../index.js';

const roomIdLength = 12;
const roomsCurrentData = {};

export const createRoom = async (req, res) => {
  try {
    const roomId = nanoid(roomIdLength);
    const { html, css, js } = req.body;
    roomsCurrentData[roomId] = { html, css, js };
    res.json({ roomId })
  } catch (err) {
    console.log('err')
  }
}

export const onSocketConnection = (socket) => {
  socket.on('CODE_CHANGED', async ({ roomId, senderId, code }) => {
    roomsCurrentData[roomId] = code;
    socket.to(roomId).emit('CODE_CHANGED', { senderId, code });
  });

  socket.on('CONNECTED_TO_ROOM', async ({ roomId, roomUserId }) => {
    socket.join(roomId);
    const code = roomsCurrentData[roomId];
    io.in(roomId).emit('START_CODE', { senderId: roomUserId, code });
  });
};
