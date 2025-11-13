// utils/auth.js
import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'change_this_secret';

export function sign(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verify(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
