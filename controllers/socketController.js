import { nanoid } from 'nanoid';
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
  socket.on('CODE_CHANGED', async ({ roomId, code, ...data }) => {
    roomsCurrentData[roomId] = code;
    socket.to(roomId).emit('CODE_CHANGED', { code, ...data });
  });

  socket.on('CONNECTED_TO_ROOM', async ({ roomId, roomUserId }) => {
    socket.join(roomId);
    const code = roomsCurrentData[roomId] || { html: '', css: '', js: '' };
    io.in(roomId).emit('START_CODE', { senderId: roomUserId, code });
  });
};
