import { nanoid } from 'nanoid';
import moment from 'moment';
import UserModel from '../models/User.js';

const roomIdLength = 12;

export const createRoom = async (req, res) => {
  try {
    //const { _doc: { username } } = await UserModel.findOne({ _id: req.userId });
    const { userId } = req;
    const roomId = nanoid(roomIdLength);


  } catch (err) {}
  
}
