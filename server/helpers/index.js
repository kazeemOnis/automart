import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export function propertyChecker(obj = {}, ...properties) {
  let result = true;
  for (let i = 0; i < properties.length; i += 1) {
    if (!(properties[i] in obj)) {
      result = false;
      break;
    }
  }
  return result;
}

export function regexChecker(regex, value) {
  return regex.test(value.toString());
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.message = message;
    this.success = false;
  }
}

export const serverError = {
  status: 500,
  message: 'Server Error',
  success: false,
};

export const authError = {
  status: 401,
  message: 'Unauthorizerd Access, Provide Valid Token',
  success: false,
};

export async function hashPassword(password) {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (err) {
    throw err;
  }
}

export async function comparePassword(password, passwordHash) {
  try {
    const result = await bcrypt.compare(password, passwordHash);
    return result;
  } catch (err) {
    throw err;
  }
}

export async function verifyToken(token) {
  try {
    const verify = await jwt.verify(token, process.env.SECRET_KEY);
    return verify;
  } catch (err) {
    throw err;
  }
}

export async function generateToken(params) {
  try {
    const token = await jwt.sign(params, process.env.SECRET_KEY, { expiresIn: '12h' });
    return token;
  } catch (err) {
    throw err;
  }
}
