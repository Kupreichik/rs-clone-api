import { body } from 'express-validator';

export const registerValidation = [
  body('name', 'Enter a name').isLength({ min: 3 }),
  body('username', 'Enter correct username').isLength({ min: 3 }),
  body('email', 'Invalid email format').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({
    min: 6,
  }),
];
