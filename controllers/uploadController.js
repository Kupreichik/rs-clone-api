import fs from 'fs';
import multer from 'multer';
import { BASE_URL } from '../index.js';
import UserModel from '../models/User.js';

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('images')) {
      fs.mkdirSync('images');
    }
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    file.originalname = `${req.userId}.${extension}`;
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });

export const imgUpload = (req, res) => {
  const url = `${BASE_URL}/images/${req.file.originalname}`;

  UserModel.findOneAndUpdate(
    {
      _id: req.userId,
    },
    {
      avatar: url,
    },
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Some server error',
        });
      }
    }
  );

  res.json({ avatar: url });
};

