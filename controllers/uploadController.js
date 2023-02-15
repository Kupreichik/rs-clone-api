import fs from 'fs';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { BASE_URL } from '../index.js';
import UserModel from '../models/User.js';

const imgIdLength = 8;

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('images')) {
      fs.mkdirSync('images');
    }
    cb(null, 'images');
  },
  filename: (_, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    file.originalname = `${nanoid(imgIdLength)}.${extension}`;
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });

export const imgUpload = async (req, res) => {
  const defaultUrl = `${BASE_URL}/images/user-default-avatar.webp`;
  const url = `${BASE_URL}/images/${req.file.originalname}`;
  try {
    const { avatar } = await UserModel.findOne({ _id: req.userId });

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

    if (avatar !== defaultUrl) {
      const file = avatar.replace(`${BASE_URL}/`, '');

      fs.unlink(file, (err) => {
        if (err) {
          return res.status(500).json({
            message: 'Some server error',
          });
        } else {
          return res.json({ avatar: url });
        }
      });
    }

    res.json({ avatar: url });
  } catch (err) {
    res.status(500).json({
      message: 'Some server error',
    });
  }
};

export const imgRemove = async (req, res) => {
  const defaultUrl = `${BASE_URL}/images/user-default-avatar.webp`;
  try {
    const { avatar } = await UserModel.findOne({ _id: req.userId });

    if (avatar === defaultUrl) return res.json({ avatar });

    const file = avatar.replace(`${BASE_URL}/`, '');

    fs.unlink(file, (err) => {
      if (err) return res.status(500).json({
        message: 'Some server error',
      });

      UserModel.findOneAndUpdate(
        {
          _id: req.userId,
        },
        {
          avatar: defaultUrl,
        },
        (err) => {
          if (err) {
            console.log(err);
            throw err;
          } else {
            res.json({ avatar: defaultUrl });
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Some server error',
    });
  }
}
