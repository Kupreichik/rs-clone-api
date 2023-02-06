import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

    const doc = new UserModel({ name, username, email, passwordHash: hash });

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
      message: 'Failed to login',
    });
  }
}
