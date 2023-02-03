import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

export const checkUsername = async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.params.uniqName });

    if (!user) {
      return res.json({
        canUse: true,
      });
    } else {
      return res.json({
        canUse: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Some server error',
    });
  }
};

export const register = async (req, res) => {
  try {

    const usedEmail = await UserModel.findOne({ email: req.body.email });
    if (usedEmail) {
      return res.status(403).json({
        message: 'User with this email is already registered',
      });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        username: user.username,
      },
      'secretCode007',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, _id, __v, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to register',
    });
  }
};
