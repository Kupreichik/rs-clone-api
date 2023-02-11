import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import querystring from 'querystring';
import pkg from 'lodash';
import axios from 'axios';
import { BASE_URL } from '../index.js';
import UserModel from '../models/User.js';

const { get } = pkg;
const secret = 'secretCode007';
const COOKIE_NAME = 'cp-access';

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
    const { name, username, _email, password } = req.body;

    const usedEmail = await UserModel.findOne({ email: _email });
    if (usedEmail) {
      return res.status(403).json({
        message: 'User with this email is already registered',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const avatar = `${BASE_URL}/images/user-default-avatar.webp`;

    const doc = new UserModel({ name, username, email: _email, avatar, passwordHash: hash });

    const user = await doc.save();

    const token = getToken(user);

    const { email, passwordHash, _id, __v, ...userData } = user._doc;

    res
      .cookie(COOKIE_NAME, token, {
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

    const token = getToken(user);

    const { email, passwordHash, _id, __v, ...userData } = user._doc;

    res
      .cookie(COOKIE_NAME, token, {
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

  const token = req.cookies[COOKIE_NAME];

  if (token) {
    try {
      const decoded = jwt.verify(token, secret);
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

    const { email, passwordHash, _id, __v, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Some server error',
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie(COOKIE_NAME).json({
      message: 'Logout successful',
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Some server error',
    });
  }
}

const getGitHubUser = async ({ code }) => {
  const githubToken = await axios
    .post(
      `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
    });

  const decoded = querystring.parse(githubToken);

  const accessToken = decoded.access_token;

  return axios
    .get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(`Error getting user from GitHub  `, err.message);
    });
}

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'c7a99918604b2ae5c655';
const GITHUB_CLIENT_SECRET =
  process.env.GITHUB_CLIENT_SECRET ||
  '938c95a649e2c73272dca40ae5d72af72b186c88';

export const githubAuth = async (req, res) => {
  try {
    const code = get(req, 'query.code');
    const path = get(req, 'query.path', '/');
    const gitHubUser = await getGitHubUser({ code });

    let user = await UserModel.findOne({ username: gitHubUser.login });
    
    if (!user) {
      const doc = new UserModel({
        name: gitHubUser.name || '  ',
        username: gitHubUser.login,
        avatar:
          gitHubUser.avatar_url ||
          `${BASE_URL}/images/user-default-avatar.webp`,
      });

      user = await doc.save();
    }

    const token = getToken(user);

    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
      });
    res.redirect(`http://localhost:3000${path}`);

  } catch (err) {
    console.log(err.message);
  }
};

const getToken = ({ _id }) => {
  return jwt.sign(
    {
      _id
    },
    secret,
    {
      expiresIn: '30d',
    }
  );
}
