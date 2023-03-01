import { body } from 'express-validator';

export const registerValidation = [
  body('name', 'Name must have more than 3 characters')
    .isLength({ min: 3 }),
  body('username', 'Username must have more than 3 characters')
    .isLength({ min: 3 }),
  body('email', 'Email email is not valid').isEmail().normalizeEmail(),
  body('password', 'Password must have more than 6 characters')
    .isLength({ min: 6 }),
];

export const penCreateValidation = [
  body('title', 'Title must have more than 3 characters').isLength({ min: 3 }),
  body('html', 'HTML must be sent').exists(),
  body('css', 'CSS must be sent').exists(),
  body('js', 'JS must be sent').exists(),
];
