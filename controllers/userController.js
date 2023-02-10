import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BASE_URL } from '../index.js';
import UserModel from '../models/User.js';

export const checkUsername = async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.params.uniqName });

    return res.json({
      canUse: !user,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Some server error',
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const usedEmail = await UserModel.findOne({ email });
    if (usedEmail) {
      return res.status(403).json({
        message: 'User with this email is already registered',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const avatar = `${BASE_URL}/images/user-default-avatar.webp`;

    const doc = new UserModel({ name, username, email, avatar, passwordHash: hash });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secretCode007',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, _id, __v, ...userData } = user._doc;

    res
      .cookie('cp-access', token, {
        httpOnly: true,
      })
      .json(userData);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to register',
    });
  }
};

export const login = async (req, res) => {
  try{
    const accessError = {
        message:
          'The username or password you entered is incorrect, please try again',
      }
    const { identifier, password } = req.body;
    const user =
      (await UserModel.findOne({ username: identifier })) ||
      (await UserModel.findOne({ email: identifier }));

    if (!user) return res.status(403).json(accessError);

    const isValidPass = await bcrypt.compare(password, user._doc.passwordHash);

    if (!isValidPass) return res.status(403).json(accessError);

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secretCode007',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, _id, __v, ...userData } = user._doc;

    res
      .cookie('cp-access', token, {
        httpOnly: true,
      })
      .json(userData);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to login',
    });
  }
}

export const checkAuth = (req, res, next) => {
  const accessError = {
    message: 'Access token is missing or invalid',
  };

  const token = req.cookies['cp-access'];

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secretCode007');
      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(403).json(accessError);
    }
  } else {
    return res.status(403).json(accessError);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.userId });

    if (!user) {
      return res.status(404).json({
        message: 'User is not found',
      });
    }

    const { passwordHash, _id, __v, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Some server error',
    });
  }
};
